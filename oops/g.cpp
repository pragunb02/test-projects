#include <iostream>
#include <vector>
using namespace std;

// Component Class: Engine
class Engine {
public:
    void start() {
        cout << "Engine starts." << endl;
    }
};

// Component Class: Wheel
class Wheel {
public:
    void rotate() {
        cout << "Wheel rotates." << endl;
    }
};

// Composite Class: Car
class Car {
private:
    Engine engine;                     // Composition: Car has an Engine
    vector<Wheel> wheels;              // Composition: Car has Wheels

public:
    Car() : wheels(4) {
        
    }                // Initialize with 4 wheels

    void startCar() {
        engine.start();                 // Delegating to Engine
        for(auto &wheel : wheels) {
            wheel.rotate();             // Delegating to Wheel
        }
        cout << "Car is running." << endl;
    }
};

int main() {
    Car myCar;
    myCar.startCar();

    return 0;
}