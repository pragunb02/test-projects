#include <iostream>

class NonDefault {
public:
    NonDefault(int x) {
        std::cout << "NonDefault: Parameterized constructor called with x = " << x << std::endl;
    }
};

class Example {
private:
    NonDefault nd;

public:
    // Initialize 'nd' with 42
    Example() : nd(42) {
        std::cout << "Example: Default constructor called." << std::endl;
    }
};

int main() {
    Example ex;
    return 0;
}