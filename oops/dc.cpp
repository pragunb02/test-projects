#include <iostream>
#include <bits/stdc++.h>
using namespace std;
class Animal {
public:
    Animal(string name) {
        std::cout << "Animal name: "  << name<<std::endl;
    }
};

class Dog : public Animal{
public:
    Dog(string name) : Animal(name) { // Calls Animal's constructor
        std::cout << "Dog created" << name << std::endl;
    }
};

int main() {
    string name="lp";
    Dog dog(name);
    return 0;
}