#include <iostream>
using namespace std;

class Counter {
public:
    static int count; // Declaration of static data member

    Counter() {
        count++;
    }

    ~Counter() {
        count--;
    }
};

// Definition and initialization of static data member
int Counter::count = 0;

int main() {
    cout << "Initial count: " << Counter::count << endl; // 0

    Counter c1;
    cout << "Count after creating c1: " << Counter::count << endl; // 1

    Counter c2;
    cout << "Count after creating c2: " << Counter::count << endl; // 2

    {
        Counter c3;
        cout << "Count after creating c3: " << Counter::count << endl; // 3
    } // c3 is destroyed

    cout << "Count after destroying c3: " << Counter::count << endl; // 2

    return 0;
}