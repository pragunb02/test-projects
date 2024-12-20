#include <iostream>
#include <cstring>

class DeepCopy {
public:
    char* data;
    int d;

    // Constructor
    DeepCopy(const char* str,int t) {
        data = new char[std::strlen(str) + 1];
        std::strcpy(data, str);
        d=t;
    }

    // Copy Constructor (deep copy)
    DeepCopy(const DeepCopy &other) {
        data = new char[std::strlen(other.data) + 1];
        std::strcpy(data, other.data);
        d=other.d;
    }

    // Destructor
    ~DeepCopy() {
        delete[] data;
    }
};

int main() {
    DeepCopy dc1("Hello",9);
    DeepCopy dc2 = dc1; // Deep copy

    std::cout << "dc1 data: " << dc1.data << std::endl;
    std::cout << "dc2 data: " << dc2.data << std::endl;

    dc1.data[0] = 'h'; // Modifying dc1 does not affect dc2
    dc1.d=5;

    std::cout << "After modification:" << std::endl;
    std::cout << "dc1 data: " << dc1.data << " "<<dc1.d<<std::endl;
    std::cout << "dc2 data: " << dc2.data <<  " "<<dc2.d<<std::endl;

    // Destructor called for dc1 and dc2, safely deleting separate memory
    return 0;
}