#include <iostream>
using namespace std;

class Vehicle {
public:
    void start() {
        cout << "Vehicle starts." << endl;
    }
};

class Car : public Vehicle {
public:
    void drive() {
        cout << "Car drives." << endl;
    }
};

class Boat : public Vehicle {
public:
    void sail() {
        cout << "Boat sails." << endl;
    }
};

class AmphibiousVehicle : public Car, public Boat { // Diamond inheritance
public:
    void operate() {
        // Ambiguous call: which 'start'?
        start(); // Compiler Error: request for member 'start' is ambiguous

        // Resolve ambiguity by specifying the path
        Car::start();  // Calls Vehicle::start via Car
        Boat::start(); // Calls Vehicle::start via Boat

        drive();
        sail();
    }
};

int main() {
    AmphibiousVehicle av;
    av.operate();
    return 0;
}