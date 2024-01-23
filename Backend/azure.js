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

//Make a BIGGER array to store the sentArr data and sort it by date for the history feature
function main(refText, lang, audioFile) {
    var audioConfig = sdk.AudioConfig.fromWavFileInput(fs.readFileSync(audioFile));
    var speechConfig = sdk.SpeechConfig.fromSubscription(subscriptionKey, serviceRegion);
    var sentArr = {
        index: [],
        word: [],
        accuracyScore: [],
        errorType: []
    };

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
            sentArr.index.push(idx + 1);
            sentArr.word.push(word.Word);
            sentArr.accuracyScore.push(word.PronunciationAssessment.AccuracyScore);
            sentArr.errorType.push(word.PronunciationAssessment.ErrorType);
        });
        reco.close();
        app.get('/api', (req, res) => {res.json({"Overall Accuracy Score": [pronunciation_result.accuracyScore], "Pronunciation Score": [pronunciation_result.pronunciationScore], "Completeness Score": [pronunciation_result.completenessScore], "Fluency Score": [pronunciation_result.fluencyScore], "Prosody Score": [pronunciation_result.prosodyScore], "sentDetails": [sentArr]});})
        //res.send(hi);
        console.log(sentArr)
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
        main(req.body.searchVal, req.body.lang, outputPath);
        res.sendStatus(200);
    } 
    catch (error) {console.error('Failed to convert file to WAV format', error); res.sendStatus(409);}
})

app.listen(3000, () => {
console.log('Server is running on port 3000');
});