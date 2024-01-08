const express = require('express');
const sdk = require("microsoft-cognitiveservices-speech-sdk");
const _ = require('lodash');
var fs = require("fs");
require('dotenv').config();

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
        console.log(" Accuracy score: ", pronunciation_result.accuracyScore, '\n',
            "pronunciation score: ", pronunciation_result.pronunciationScore, '\n',
            "completeness score : ", pronunciation_result.completenessScore, '\n',
            "fluency score: ", pronunciation_result.fluencyScore, '\n',
            "prosody score: ", pronunciation_result.prosodyScore
        );
        console.log("  Word-level details:");
        _.forEach(pronunciation_result.detailResult.Words, (word, idx) => {
            console.log("    ", idx + 1, ": word: ", word.Word, "\taccuracy score: ", word.PronunciationAssessment.AccuracyScore, "\terror type: ", word.PronunciationAssessment.ErrorType, ";");
        });
        reco.close();
    }

    reco.recognizeOnceAsync(function (successfulResult) {onRecognizedResult(successfulResult);})
}

main()

app.listen(3000, () => {
console.log('Server is running on port 3000');
});