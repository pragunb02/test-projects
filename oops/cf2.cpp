#include<bits/stdc++.h>
// #include<ext/pb_ds/assoc_container.hpp>
// #include<ext/pb_ds/tree_policy.hpp>

using namespace std;
// using namespace _gnu_pbds;

#define RS ios_base::sync_with_stdio(false);cin.tie(NULL);cout.tie(NULL)
#define ll long long
#define ld long double
#define PI 3.141592653589793238462 //21 decimal
#define lb lower_bound
#define ub upper_bound
#define pb push_back
#define pob pop_back
#define pof pop_front
#define puf push_front
#define mp make_pair
#define sz(x) (ll)x.size()
#define fo(i,a,b) for(i=a;i<=b;i++)
#define fr(i,a,b) for(i=a;i>=b;i--)
// #define fo(i, k, n) for (int i = k; k < n ? i < n : i > n; k < n ? i++ : i--)
#define read(a, n) for(ll i = 0; i < n; ++i) cin >> a[i];
#define print(a, n) for(ll i = 0; i < n; ++i) if(i == n - 1){ cout << a[i] << endl; } else { cout << a[i] << ' '; }
#define fa(x,V) for(auto x:V)
#define ff first
#define ss second
#define endl '\n';
// #define endl "\n";
#define all(v) (v).begin(),(v).end()
#define allr(v) (v).rbegin(),(v).rend()
#define sorting(v) sort(all(x))
#define clear(V,x) memeset(V,x,sz(V))  // x-> char,0,-1
                       // sizeof(V)
#define ps(x,y)  fixed<<setprecision(y)<<x
#define maxint 2147483647
#define minint -2147483648
#define YES cout<<"YES"<<endl;
#define NO cout<<"NO"<<endl;
#define Yes cout<<"Yes"<<endl;
#define No cout<<"No"<<endl;
const ll mod = 998244353;


void __print(int x) { cerr << x; }
void __print(long x) { cerr << x; }
void __print(long long x) { cerr << x; }
void __print(unsigned x) { cerr << x; }
void __print(unsigned long x) { cerr << x; }
void __print(unsigned long long x) { cerr << x; }
void __print(float x) { cerr << x; }
void __print(double x) { cerr << x; }
void __print(long double x) { cerr << x; }
void __print(char x) { cerr << '\'' << x << '\''; }
void __print(const char *x) { cerr << '\"' << x << '\"'; }
void __print(const string &x) { cerr << '\"' << x << '\"'; }
void __print(bool x) { cerr << (x ? "true" : "false"); }

template <typename T, typename V>
void __print(const pair<T, V> &x)
{
    cerr << '{';
    __print(x.first);
    cerr << ',';
    __print(x.second);
    cerr << '}';
}
template <typename T>
void __print(const T &x)
{
    int f = 0;
    cerr << '{';
    for (auto &i : x)
        cerr << (f++ ? "," : ""), __print(i);
    cerr << "}";
}
void _print() { cerr << "]\n"; }
template <typename T, typename... V>
void _print(T t, V... v)
{
    __print(t);
    if (sizeof...(v))
        cerr << ", ";
    _print(v...);
}
#ifndef ONLINE_JUDGE
#define debug(x...)               \
    cerr << "[" << #x << "] = ["; \
    _print(x)
#else
#define debug(x...)
#endif

ll inv(ll i){
    if (i == 1)
     return 1; 
    return (mod - ((mod / i) * inv(mod % i)) % mod) % mod;
}

ll mod_add(ll a, ll b){    // mod_sub b=-b
     a = a % mod;
     b = b % mod;
     return (((a + b) % mod) + mod) % mod;
}

ll mod_mul(ll a,ll b){     // mod_div b=inv(b)
    a=a%mod;
    b=b%mod;
    return (((a*b)%mod)+mod)%mod;
}

ll mod_expo(ll base ,ll power,ll modo){  // base can be pos aur neg but power is always pos
    if(power==0)return 1;
    ll c=mod_expo(base,power/2,modo);
    if(power%2==0)return mod_mul(c,c);
    else return mod_mul(c,mod_mul(c,base));
}

ll gcd(ll a, ll b) {
    if (b == 0) return a;
    return gcd(b, a % b);
}

ll powof2(ll x){
    return 1LL << x;
}

ll digits(ll n) {
    return floor(log10(n)) + 1;
}
 
ll lcm(ll a, ll b) {
    return (a / gcd(a, b)) * b;
}

bool comp(ll a,ll b){
    return a<b;
}

bool cmp(pair<ll,ll> &a,pair<ll,ll> &b){
    if(a.ff==b.ff)
        return a.ss<b.ss;
    return a.ff<b.ff;
}

ll max3(ll a,ll b,ll c){
    return max(a,max(b,c));
}

ll min3(ll a,ll b,ll c){
    return min(a,min(b,c));
}

ll max4(ll a,ll b,ll c, ll d){
    return max(a,max(b,max(c,d)));  // max(max(max(a,b),c),d)
}

ll min4(ll a,ll b,ll c, ll d){
    return min(a,min(b,min(c,d)));
}
// in game ques
// even odd
// sum

/*
 
1. Think Greedy
2. Think Brute Force
3. Think solution in reverse order
4. Think DP [ check constraints carefully ]
5. Check base cases for DP and prove solution for Greedy
6. Think Graph 
7. Think about prefix and suffix sum techniques 

*/


void solve()
{
    ll n; cin>>n;
    vector<array<ll,4>>vec(n);
    for(ll i=0;i<n;i++){
        ll u,v; cin>>u>>v;
        vec[i]={min(u,v),max(u,v),u,v};
    }
    sort(all(vec));
    for(ll i=0;i<n;i++){
        cout<<vec[i][2]<<" "<<vec[i][3]<<" \n"[i==n-1];
    }
}

int32_t main()
{
    RS;
    ll n,x,y,ans,temp,sum,tt;
    string str;
    tt=1;
    cin>>tt;
    for(ll i=1;i<=tt;i++){
        //cout << "Case #" << i << ": ";
        solve();
    }
    
return 0;

}
