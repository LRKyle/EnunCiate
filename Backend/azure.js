const express = require('express');
const bodyParser = require('body-parser');
const sdk = require("microsoft-cognitiveservices-speech-sdk");
const _ = require('lodash');
var fs = require("fs");
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

const subscriptionKey = process.env.AZUREKEY;
const serviceRegion = process.env.AZUREREGION;

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
    speechConfig.speechRecognitionLanguage = 'en-US'//lang;

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
        });
        reco.close();


        app.get('/api', (req, res) => {
            res.json({"Overall Accuracy Score": [pronunciation_result.accuracyScore], "Pronunciation Score": [pronunciation_result.pronunciationScore], "Completeness Score": [pronunciation_result.completenessScore], "Fluency Score": [pronunciation_result.fluencyScore], "Prosody Score": [pronunciation_result.prosodyScore], "Word-level details": [pronunciation_result.detailResult.Words]});
            //res.send(hi);
        })


    }
    reco.recognizeOnceAsync(function (successfulResult) {onRecognizedResult(successfulResult);})
}

app.post('/backend', (req, res) => {
    const searchVal = req.body.searchVal;
    const langVal = req.body.langVal;
    const uri = req.body.uri;
    console.log(req.body.searchVal, "if ourrrrrrr love is tragedy why are you my remedy", req.body.langVal, req.body.uri);


   // main(req.body.searchVal, req.body.langVal, req.body.uri);
});

app.listen(3000, () => {
console.log('Server is running on port 3000');
});