import {generateSecretCode} from '../game'

export const NEW_GAME = "NEW_GAME";
export const CHANGE_COLOR = "CHANGE_COLOR";
export const SCORE_GUESS = "SCORE_GUESS";
export const NEW_CHALLENGE = "NEW_CHALLENGE";
export const CHANGE_CHALLENGE_COLOR = "CHANGE_CHALLENGE_COLOR";
export const CHALLENGE_SCORE_GUESS = "CHALLENGE_SCORE_GUESS";
export const DROP_COLOR = "DROP_COLOR";
export const DELETE_CHART_COLOR = "DELETE_CHART_COLOR";
export const NEW_CHART = "NEW_CHART";

export function newGame(secretCode = generateSecretCode()) {
    return {type: NEW_GAME, secretCode}
}

export function scoreGuess(rowIndex) {
    return {type: SCORE_GUESS, rowIndex}
}

export function challengeScoreGuess(rowIndex, challengeNumber) {
    return {type: CHALLENGE_SCORE_GUESS, rowIndex, challengeNumber}
}

export function changeColor(rowIndex, index, newColor) {
    return {type: CHANGE_COLOR, rowIndex, index, newColor}
}

export function changeChallengeColor(rowIndex, index, newColor, challengeNum) {
    return {type: CHANGE_CHALLENGE_COLOR, rowIndex, index, newColor, challengeNum}
}

export function newChallenge(gameId) {
    return {type: NEW_CHALLENGE, gameId}
}

export function dropColor(color, cellIndex) {
    return {type: DROP_COLOR, color, cellIndex}
}

export function deleteChartColor(color, cellIndex) {
    return {type: DELETE_CHART_COLOR, color, cellIndex}
}

export function newChart() {
    return {type: NEW_CHART}
}

