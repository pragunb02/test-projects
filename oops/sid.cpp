bhai free hai kya doubt tha

gptclude <iostream>
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

    // Copy Assignment Operator (deep copy)
    DeepCopy& operator=(const DeepCopy& other) {
        if (this == &other)
            return *this; // Self-assignment check

        delete[] data; // Release existing resource

        data = new char[std::strlen(other.data) + 1];
        std::strcpy(data, other.data);
        d=other.d;

        return *this;
    }

    ~DeepCopy() {
        delete[] data;
    }
};

int main() {
    DeepCopy dc1("Hello",9);
    DeepCopy dc2 = dc1; // Deep copy

    std::cout << "dc1 data: " << dc1.data << std::endl;
    std::cout << "dc2 data: " << dc2.data << std::endl;

    dc1.data[0] = 'h';
    dc1.d=5;

    std::cout << "After modification:" << std::endl;
    std::cout << "dc1 data: " << dc1.data << " "<<dc1.d<<std::endl;
    std::cout << "dc2 data: " << dc2.data <<  " "<<dc2.d<<std::endl;
    DeepCopy dc3("Pragun",67);
    std::cout << "dc3 data: " << dc3.data << " "<<dc3.d<<std::endl;
    dc3=dc2;
    std::cout << "After modification:" << std::endl;
    std::cout << "dc3 data: " << dc3.data << " "<<dc3.d<<std::endl;
    return 0;
}


copy constructor ya ssignment operator  mai ‘const reference’ of object he kyu pass kar rhe hai
const ka to smj aa gya taki original object mai chnage na ho kyuki we are passing refercne of the original object not a copy
but doubt ye hai reference kyu pass kar rhe hai
(reference k bina error aa rha hai)
(gpt kra to kuch infinite loop kuch bol rha hai smj nhi aa rha but)
