#include <iostream>
#include <string>
#include <cstdlib>


void recordVoice() {
    std::cout << "Recording audio... Speak now (5 sec)\n";

    
    #ifdef _WIN32
        system("ffmpeg -f dshow -i audio=\"Microphone\" -t 5 voice.wav -y");
    #else
        
        system("arecord -d 5 -f cd -t wav voice.wav -y"); 
    #endif

    std::cout << "Recording saved as voice.wav\n";
}


std::string callVoskAPI() {
    std::cout << "Processing audio with Vosk API...\n";

    
    std::string command = "vosk-cli --model vosk-model-small-en-us --file voice.wav > transcription.txt";
    system(command.c_str());

   
    std::ifstream file("transcription.txt");
    std::string transcript((std::istreambuf_iterator<char>(file)), std::istreambuf_iterator<char>());
    file.close();

    return transcript;
}


void processText(const std::string &text) {
    std::cout << "\nProcessing: " << text << "\n";

    if (text.find("meeting") != std::string::npos) {
        std::cout << "✔ Action: Schedule a meeting.\n";
    } else if (text.find("task") != std::string::npos) {
        std::cout << "✔ Action: Add a task.\n";
    } else {
        std::cout << "✔ Action: Save as a note.\n";
    }
}

int main() {
    recordVoice();
    
    std::string transcript = callVoskAPI();
    std::cout << "Transcription: " << transcript << "\n";

    processText(transcript);

    return 0;
}