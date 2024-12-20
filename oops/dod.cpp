#include <iostream>
#include <string>

// Base class with both default and parameterized constructors
class Base {
public:
    Base() {
        std::cout << "Base default constructor called.\n";
    }
    
    Base(int x) {
        std::cout << "Base parameterized constructor called with x = " << x << ".\n";
    }
};

// Derived class with default and parameterized constructors
class Derived : public Base {
public:
    // Derived default constructor
    Derived() : Base(5) { // Optional: Explicitly calling Base()
        std::cout << "Derived default constructor called.\n";
    }
    
    // Derived parameterized constructor
    Derived(int y) : Base() { // Explicitly calling Base(int)
        std::cout << "Derived parameterized constructor called with y = " << y << ".\n";
    }
};

int main() {
    std::cout << "Creating Derived object with default constructor:\n";
    Derived obj1;
    
    std::cout << "\nCreating Derived object with parameterized constructor:\n";
    Derived obj2(42);
    
    return 0;
}