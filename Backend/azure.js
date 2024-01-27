const express = require('express');
const bodyParser = require('body-parser');
const sdk = require("microsoft-cognitiveservices-speech-sdk");
const _ = require('lodash');
var fs = require("fs");
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
//Make a BIGGER array to store the errArr data and sort it by date for the history feature

var errArr = {
    index: [],
    word: [],
    accuracyScore: [],
    errorType: []
};

function main(refText, lang, audioFile) {
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
        console.log("pronunciation assessment for: ", result.text);
        var pronunciation_result = sdk.PronunciationAssessmentResult.fromResult(result);
        console.log(" Overall Accuracy score: ", pronunciation_result.accuracyScore, '\n',
            "Pronunciation score: ", pronunciation_result.pronunciationScore, '\n',
            "Completeness score : ", pronunciation_result.completenessScore, '\n',
            "Fluency score: ", pronunciation_result.fluencyScore, '\n',
            "Prosody score: ", pronunciation_result.prosodyScore
        );
        console.log("  Word-level details:");
        _.forEach(pronunciation_result.detailResult.Words, (word, idx) => {
            console.log("    ", idx + 1, ": word: ", word.Word, "\taccuracy score: ", word.PronunciationAssessment.AccuracyScore, "\terror type: ", word.PronunciationAssessment.ErrorType, ";");
            if (word.PronunciationAssessment.ErrorType != "None") {
                errArr['index'].push(idx + 1);
                errArr['word'].push(word.Word);
                errArr['accuracyScore'].push(word.PronunciationAssessment.AccuracyScore);
                errArr['errorType'].push(word.PronunciationAssessment.ErrorType);                
            }
        });
        reco.close();
        
        data = {
            "Overall Accuracy Score": [pronunciation_result.accuracyScore], 
            "Pronunciation Score": [pronunciation_result.pronunciationScore], 
            "Completeness Score": [pronunciation_result.completenessScore], 
            "Fluency Score": [pronunciation_result.fluencyScore], 
            "Prosody Score": [pronunciation_result.prosodyScore], 
            "errDetails": errArr
        }
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

    errArr = {
        index: [],
        word: [],
        accuracyScore: [],
        errorType: []
    };

    try {
        await convertToWav(inputPath, outputPath);
        console.log(outputPath)
        main(req.body.searchVal, req.body.lang, outputPath);
        res.sendStatus(200);
    } 
    catch (error) {console.error('Failed to convert file to WAV format', error); res.sendStatus(409);}
})

app.listen(3000, () => {
console.log('Server is running on port 3000');
});

app.get('/api', (req, res) => {
    console.log(data, "respect the hero!")
    res.json(data);
    
});
/*if (word.PronunciationAssessment.ErrorType != sdk.PronunciationAssessmentErrorType.None) {
                errArr.
            } 
To isolate the errors and the words that are wrong, we can use the following code^
*/