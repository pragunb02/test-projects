#include <iostream>
#include <string>

class Secret;

class SecretKeeper {
public:
    // Friend member function declaration
    void reveal(const Secret& s){
         std::cout << "The secret message is: " << s.secretMessage << std::endl;
}
};

class Secret {
private:
    std::string secretMessage;

public:
    Secret(const std::string& msg) : secretMessage(msg) {}

    // Declare the 'reveal' member function of SecretKeeper as a friend
    friend void SecretKeeper::reveal(const Secret& s);
};

// // Friend member function definition
// void SecretKeeper::reveal(const Secret& s) {
//     std::cout << "The secret message is: " << s.secretMessage << std::endl;
// }

int main() {
    Secret mySecret("C++ is versatile!");
    SecretKeeper keeper;
    keeper.reveal(mySecret); // Accesses private member 'secretMessage'
    return 0;
}