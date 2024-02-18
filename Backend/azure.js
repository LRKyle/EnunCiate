const express = require('express');
const bodyParser = require('body-parser');
const sdk = require("microsoft-cognitiveservices-speech-sdk");
const _ = require('lodash');
var fs = require("fs");
const path = require('path');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath('./ffmpeg-6.1.1-essentials_build/bin/ffmpeg.exe');
require('dotenv').config();

const app = express();
app.use(express.json({limit: '50mb'}));

const subscriptionKey = process.env.AZUREKEY;
const serviceRegion = process.env.AZUREREGION;
let data = {};



function main(refText, lang, audioFile, res) {
    var errArr = {
        mistakes: [],
        accuracyScore: [],
        errorType: []
    };

    var audioConfig = sdk.AudioConfig.fromWavFileInput(fs.readFileSync(audioFile));
    var speechConfig = sdk.SpeechConfig.fromSubscription(subscriptionKey, serviceRegion);
    var reference_text = refText

    const pronunciationAssessmentConfig = new sdk.PronunciationAssessmentConfig(
        reference_text,
        sdk.PronunciationAssessmentGradingSystem.HundredMark,
        sdk.PronunciationAssessmentGranularity.Phoneme,
        true
    );
    pronunciationAssessmentConfig.enableProsodyAssessment = true;
    speechConfig.speechRecognitionLanguage = lang

    var reco = new sdk.SpeechRecognizer(speechConfig, audioConfig);
    pronunciationAssessmentConfig.applyTo(reco);

    function onRecognizedResult(result) {
        if (result.text == undefined) {res.sendStatus(500);}
        else {res.sendStatus(200);}
        console.log("pronunciation assessment for: ", result.text);
        var pronunciation_result = sdk.PronunciationAssessmentResult.fromResult(result);
        console.log(" Overall Accuracy score: ", pronunciation_result.accuracyScore, '\n',
            "Pronunciation score: ", pronunciation_result.pronunciationScore, '\n',
            "Completeness score : ", pronunciation_result.completenessScore, '\n',
            "Fluency score: ", pronunciation_result.fluencyScore, '\n',
            "Prosody score: ", pronunciation_result.prosodyScore
        );
        //console.log("  Word-level details:");
        _.forEach(pronunciation_result.detailResult.Words, (word, idx) => {
            console.log("    ", idx + 1, ": word: ", word.Word, "\taccuracy score: ", word.PronunciationAssessment.AccuracyScore, "\terror type: ", word.PronunciationAssessment.ErrorType, ";");

            if (word.PronunciationAssessment.ErrorType != "None") {
                errArr['mistakes'].push(word.Word);           
            }
            errArr['errorType'].push(word.PronunciationAssessment.ErrorType);      
            errArr['accuracyScore'].push(word.PronunciationAssessment.AccuracyScore);
        });
        reco.close();
        
        //console.log(pronunciation_result.detailResult, "confus")
        data = {
            "Overall Accuracy Score": [pronunciation_result.accuracyScore], 
            "Pronunciation Score": [pronunciation_result.pronunciationScore], 
            "Completeness Score": [pronunciation_result.completenessScore], 
            "Fluency Score": [pronunciation_result.fluencyScore], 
            "Prosody Score": [pronunciation_result.prosodyScore], 
            "errDetails": errArr
        }
        console.log(req.body.searchVal, "searchVal")
        
    }
    reco.recognizeOnceAsync(function (successfulResult) {onRecognizedResult(successfulResult);})
}

function convertToWav(inputPath, outputPath) {
    return new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .output(outputPath)
        .format('wav')
        .on('end', resolve)
        .on('error', reject)
        .run();
    });
  }  

app.post('/upload', upload.single('audio-record'), async (req, res) => {
    const inputPath = req.file.path;
    const outputPath = req.file.path + '.wav'

    try {
        await convertToWav(inputPath, outputPath);
        console.log(outputPath)
        main(req.body.searchVal, req.body.lang, outputPath, res);
        //res.sendStatus(200);
    } 
    catch (error) {console.error('Failed to convert file to WAV format', error); res.sendStatus(409);}
    //fs.unlink(inputPath, (err) => {if (err) throw err;}); // In order to get rid of the data file and keep the audio ver
})

app.listen(3000, () => {console.log('Server is running on port 3000')});

function delUpload(){
    const directory = 'uploads';
    fs.readdir(directory, (err, files) => {
        if (err) throw err;
      
        for (const file of files) {
          fs.unlink(path.join(directory, file), err => {
            if (err) throw err;
          });
        }
    });
}

app.get('/api', (req, res) => {
    console.log(`Received ${req.method} request for ${req.url}`);
    res.json(data);
    console.log(data['errDetails']['accuracyScore'], "data")
    delUpload(); 
});




/*if (word.PronunciationAssessment.ErrorType != sdk.PronunciationAssessmentErrorType.None) {
                errArr.
            } 
To isolate the errors and the words that are wrong, we can use the following code^
*/