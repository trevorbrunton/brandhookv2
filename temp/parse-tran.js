import fs from "fs";

// Parse the JSON data
const transcriptionData = JSON.parse(
  fs.readFileSync("job.json", "utf8")
);

// Extract the audio segments
const audioSegments = transcriptionData.results.audio_segments;

// Create a string to store the formatted output
let output = "";

// Iterate through each audio segment
audioSegments.forEach((segment) => {
  // Add the speaker label and transcript to the output
  output += `${segment.speaker_label}: ${segment.transcript}\n\n`;
});

// Write the output to a file
fs.writeFileSync("transcription_output.txt", output);

console.log(
  "Transcription parsing complete. Output saved to transcription_output.txt"
);
