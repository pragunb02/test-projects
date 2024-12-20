#include <iostream>
using namespace std;

// Interface using an abstract class
class Drawable {
public:
    virtual void draw() = 0; // Pure virtual function
    virtual ~Drawable() {}    // Virtual destructor
};

class Circle : public Drawable {
public:
    void draw() override {
        cout << "Drawing a Circle." << endl;
    }
};

class Rectangle : public Drawable {
public:
    void draw() override {
        cout << "Drawing a Rectangle." << endl;
    }
};

int main() {
    Drawable* shape1 = new Circle();
    Drawable* shape2 = new Rectangle();

    shape1->draw(); // Outputs: Drawing a Circle.
    shape2->draw(); // Outputs: Drawing a Rectangle.

    delete shape1;
    delete shape2;

    return 0;
}