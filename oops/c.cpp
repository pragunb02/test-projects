
#include<bits/stdc++.h>
using namespace std;

class Logger {
public:
    static void log(const string& message) {
        cout << "Log: " << message << endl;
    }
};

int main() {
    Logger::log("Starting application.");
    return 0;
}