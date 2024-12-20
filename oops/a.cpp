// #include <iostream>
// using namespace std;

// class Vehicle {
// public:
//     virtual void startEngine() = 0;  // Pure virtual function
// };

// class Car : public Vehicle {
// public:
//     void startEngine() override {
//         cout << "Car engine started" << endl;
//     }
// };

// int main() {
//     Vehicle* car = new Car();
//     car->startEngine();
//     delete car;
//     return 0;
// }
#include <iostream>
using namespace std;

class Base {
public:
     void show()  { // This method cannot be overridden
        cout << "Base show()" << endl;
    }
};

class Derived : public Base {
public:
    // Attempting to override 'show' will cause a compile-time error
    // void show() override { 
    //     cout << "Derived show()" << endl;
    // }
};

int main() {
    Derived d;
    d.show(); // Calls Base::show()
    for(int i=0;i<50;i++){
        cout<<"Papa aage se aapse tammez se baat krunga"<<endl;
    }
    return 0;
}