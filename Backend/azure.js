const express = require('express');
const sdk = require("microsoft-cognitiveservices-speech-sdk");
const _ = require('lodash');
var fs = require("fs");
require('dotenv').config();


var hi = "Hello"
const app = express();

const subscriptionKey = process.env.AZUREKEY;
const serviceRegion = process.env.AZUREREGION;
const audioFile = "./assets/record_out.wav";

function main() {
    var audioConfig = sdk.AudioConfig.fromWavFileInput(fs.readFileSync(audioFile));
    var speechConfig = sdk.SpeechConfig.fromSubscription(subscriptionKey, serviceRegion);

    var reference_text = "I really really really like cakes";//Change searchVal here

    const pronunciationAssessmentConfig = new sdk.PronunciationAssessmentConfig(
        reference_text,
        sdk.PronunciationAssessmentGradingSystem.HundredMark,
        sdk.PronunciationAssessmentGranularity.Phoneme,
        true
    );
    pronunciationAssessmentConfig.enableProsodyAssessment = true;
    speechConfig.speechRecognitionLanguage = "en-US";//Change langVal here

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

main()




app.listen(3000, () => {
console.log('Server is running on port 3000');
});