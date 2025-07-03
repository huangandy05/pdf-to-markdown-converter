Dynamic Programming

Reminder: Algorithmic Complexity

What is dynamic programming? 2D DP

Exponential DP

DP with Data Structures More example problems

Dynamic Programming COMP4128 Programming Challenges

School of Computer Science and Engineering UNSW Sydney

Term 2, 2025

## Table of Contents 2

3 2D DP

![](http://localhost:8000/api/lessons/Week_3/files/dynamic-programming-slides/images/_page_1_Figure_1.jpeg)

![](http://localhost:8000/api/lessons/Week_3/files/dynamic-programming-slides/images/_page_1_Figure_2.jpeg)

Dynamic Programming

More example

problems

5 DP with Data Structures

4 Exponential DP

1 Reminder: Algorithmic Complexity

2 What is dynamic programming?

6 More example problems

### Reminder: Algorithmic Complexity 3

The running time of your solution is important! If you don't think about the time complexity of your algorithm before coding it up, sooner or later you'll end up wasting a lot of time on something something that's too

This is especially tragic in exam environments.

For simple code, analysing complexity can be as simple as multiplying together the bounds of nested for loops.

Dynamic Programming

Reminder: Algorithmic Complexity

What is

slow.

programming? 2D DP Exponential

DP

dynamic

DP with Data Structures More example problems

- For recursive solutions, a rough bound is *O*(time spent in recursive function *×* number of recursion branchesrecursion depth)
- For DP, it usually comes down to carefully determining the number of subproblems and the average time taken for each of them using the recurrence.

### Reminder: Algorithmic Complexity 4

operations than this.

algorithm will definitely time out.

Dynamic Programming

Reminder: Algorithmic Complexity

What is

dynamic programming? 2D DP Exponential DP DP with Data

Structures More example problems

> Best way to get a gauge of an online judge's speed is to submit a simple for loop and compare the number of iterations it can do in 1 second to your local environment.

This means that for *n ≤* 1*,* 000*,* 000, an *O*(*n* log *n*) algorithm will probably run in time, but an *O*(*n*

On most online judges (this applies to the problem sets), a rough guideline is 200 million operations per second.

Constant factors occasionally matter, e.g. if you have no recursion, or only tail-recursion, you might manage more

If you do floating-point arithmetic, everything will be slow

2 )

### Table of Contents 5

3 2D DP

![](http://localhost:8000/api/lessons/Week_3/files/dynamic-programming-slides/images/_page_4_Figure_1.jpeg)

![](http://localhost:8000/api/lessons/Week_3/files/dynamic-programming-slides/images/_page_4_Figure_2.jpeg)

Reminder: Algorithmic Complexity

programming? 2D DP Exponential DP

What is dynamic

DP with Data Structures More example

problems

5 DP with Data Structures

4 Exponential DP

1 Reminder: Algorithmic Complexity

2 What is dynamic programming?

6 More example problems

### Greedy algorithms don't always work 6

Dynamic Programming

Reminder: Algorithmic Complexity

What is dynamic programming? 2D DP

Exponential DP DP with Data Structures More example

problems

- We like greedy algorithms because they cut down the state space
- If a locally suboptimal choice can never contribute to the globally optimal solution, we don't have to expand nearly as many states
- But what if this doesn't work? Hill climbing etc
- We would like some way to explore many options at each stage, but efficiently - avoid repeating work

### What is dynamic programming? 7

### Dynamic Programming

- Reminder: Algorithmic Complexity
- What is dynamic programming?
- 2D DP Exponential DP
- DP with Data Structures More example

problems

- Wikipedia: "a method for solving complex problems by breaking them down into simpler subproblems"
- If we can then keep recursively breaking down those simpler subproblems into even simpler problems until we reach a subproblem which is trivial to solve, we are done.
- This sounds a lot like Divide & Conquer…
- The key aspect of Dynamic Programming is **subproblem reuse**:
	- If we have a divide & conquer algorithm that regularly reuses the same subproblem when breaking apart different larger problems, it'd be an obvious improvement to save the answer to that subproblem instead of recalculating it.
- In a way, dynamic programming is *smart recursion*

(0 *≤ n ≤* 1*,* 000*,* 000)

evaluate.

- Dynamic Programming
- Reminder: Algorithmic Complexity

What is

dynamic programming? 2D DP Exponential DP DP with Data Structures

More example problems

**Time Complexity** We recurse twice from each call to f, and the recursion depth is up to *n*. This gives a complexity of *O*(2 *n* ).

**Naïve solution** Recall that f(0) = f(1) = 1, and

**Problem statement** Compute the *n*th Fibonacci number

f(*n*) = f(*n −* 1) + f(*n −* 2). Write a recursive function and

Let's take a look at the call tree for f(4):

- Dynamic Programming
- Reminder: Algorithmic Complexity

What is dynamic programming? 2D DP Exponential DP

DP with Data Structures More example problems

![](http://localhost:8000/api/lessons/Week_3/files/dynamic-programming-slides/images/_page_8_Figure_6.jpeg)

What is f(2)?

*A problem we've seen before*.

If we don't duplicate work:

Dynamic Programming

Reminder: Algorithmic Complexity

What is dynamic programming? 2D DP Exponential DP

DP with Data Structures More example problems

![](http://localhost:8000/api/lessons/Week_3/files/dynamic-programming-slides/images/_page_9_Figure_6.jpeg)

The call tree gets a bit smaller.

Dynamic Programming

Reminder: Algorithmic Complexity

What is dynamic programming? 2D DP

Exponential DP

DP with Data Structures More example problems

![](http://localhost:8000/api/lessons/Week_3/files/dynamic-programming-slides/images/_page_10_Figure_7.jpeg)

There is even more duplicated work in bigger cases.

Dynamic Programming

Reminder: Algorithmic Complexity

dynamic programming? 2D DP Exponential DP

What is

DP with Data Structures More example problems

With "smart recursion" we could reduce the call tree to:

![](http://localhost:8000/api/lessons/Week_3/files/dynamic-programming-slides/images/_page_11_Figure_7.jpeg)

In fact, we reduce the number of calls from *O*(2 *n* ) to *O*(*n*).

### The essence of dynamic programming 13

Dynamic Programming

Reminder: Algorithmic Complexity What is dynamic programming? 2D DP Exponential DP DP with Data Structures More example problems

In general, a dynamic programming (DP) algorithm comes in three parts:

- An exact definition of the subproblems. It is convenient to define these subproblems as entities in a *state space* and refer to individual subproblems as **states**.
	- In our example, each f(*i*) is a state, and the state space includes all these states for *i* from 0 to *n*.
- A **recurrence relation**, which facilitates the breaking down of subproblems. These define the *transitions* between the states.
	- In our example, the recurrence relation is f(*n*) = f(*n −* 1) + f(*n −* 2).
- **Base cases**, which are the trivial subproblems.
	- In our example, the base cases are f(0) = 1 and f(1) = 1.

### Example problem: Sum Representation 14

**Problem statement** Given an integer *n*

**Example** If *n* = 5, there are 6 different ways:

as a sum of the integers 1, 3 and 4?

(0 *≤ n ≤* 1*,* 000*,* 000), in how many ways can *n* be written

5 = 1 + 1 + 1 + 1 + 1

= 1 + 1 + 3 = 1 + 3 + 1 = 3 + 1 + 1

Dynamic Programming

Reminder: Algorithmic Complexity

What is dynamic programming? 2D DP

Exponential DP DP with Data Structures

More example problems

- = 1 + 4
	- = 4 + 1*.*

### Example problem: Sum Representation 15

state is represented by a single integer, *n*.

Dynamic Programming

Reminder: Algorithmic Complexity

What is dynamic programming?

2D DP

Exponential DP DP with Data Structures

given by

More example problems

f(*n*) = f(*n −* 1) + f(*n −* 3) + f(*n −* 4)

**Subproblems** Let f(*n*) be the number of ways in which *n* can be represented using the numbers 1, 3 and 4. Each

**Recurrence** For *n ≥* 4, if we already know the answers for f(*n −* 1), f(*n −* 3) and f(*n −* 4), then the answer for f(*n*) is

**Base cases** By inspection, we can see that f(0) = 1, f(1) = 1, f(2) = 1 and f(3) = 2.

### Example problem: Sum Representation 16

### Dynamic Programming

Reminder: Algorithmic Complexity

What is dynamic programming? 2D DP

Exponential

DP DP with Data Structures

More example problems

A neat trick allows us to optimise this implementation to use *O*(1) memory without changing the time complexity.

**Complexity** Since we have *O*(*n*) values of f to calculate, each taking *O*(1) time to calculate, assuming that the subproblems it depends on have already been calculated,

the algorithm has overall time complexity *O*(*n*).

*f*[0] = 1, *f*[1] = 1, *f*[2] = 1, *f*[3] = 2; for (**int** *i* = 4; *i* <= *n*; *i*++) { *f*[*i*%4] = *f*[(*i*-1)%4] + *f*[(*i*-3)%4] + *f*[*i*%4]; }

*f*[0] = 1, *f*[1] = 1, *f*[2] = 1, *f*[3] = 2; for (**int** *i* = 4; *i* <= *n*; *i*++) { *f*[*i*] = *f*[*i*-1] + *f*[*i*-3] + *f*[*i*-4];

**Implementation**

}

### Implementing & Understanding DP 17

about) DP solutions.

Dynamic Programming

Reminder: Algorithmic Complexity

What is dynamic programming? 2D DP Exponential DP DP with Data

Structures More example problems

There are two main ways of implementing (and thinking

These are most commonly referred to as **top-down** *(memoised)* and **bottom-up**

### Top-down 18

Dynamic Programming

Reminder: Algorithmic Complexity What is dynamic programming? 2D DP Exponential DP DP with Data Structures More example problems

- Top-down dynamic programming takes the mathematical recurrence, and translates it directly into code.
- Answers to subproblems are cached to avoid solving them more than once. Caching function return values is widely known as *memoisation*.
- Top-down implementations are usually the easiest, because this is how most people naturally think about DP solutions.

```
int f(int n) {
  // base cases
  if (n == 0 || n == 1) return 1;
  // return the answer from the cache if we already have one
  if (cache[n]) return cache[n];
  // calculate the answer and store it in the cache
  return cache[n] = f(n-1) + f(n-2);
}
```
**Warning:** if 0 is a valid answer to a subproblem, initialise your cache array to something that isn't a valid answer.

### Bottom-up 19

Dynamic Programming

Reminder: Algorithmic Complexity What is dynamic programming? 2D DP Exponential DP DP with Data Structures More example problems

Bottom-up dynamic programming starts at the base cases and builds up all the answers one-by-one.

### *f*[0] = 1, *f*[1] = 1; for (**int** *i* = 2; *i* <= *n*; *i*++) { *f*[*i*] = *f*[*i*-1] + *f*[*i*-2]; }

- **Warning:** when answering a subproblem, we must make sure that all subproblems it will look at are already answered.
	- In this example, the order in which states depend on each other is straightforward; this is not always the case.
	- In general, the dependency between DP states forms a **directed acyclic graph** (DAG).
	- If the state dependency graph has a cycle, it's not a valid DP!
- Some algorithms are easier to think about this way. For example, the Floyd-Warshall algorithm is a DP, most easily implemented bottom-up.

### Top-down or bottom-up? 20

Dynamic Programming

Reminder: Algorithmic Complexity What is dynamic programming? 2D DP Exponential DP DP with Data Structures More example problems

- Top-down generally admits a more direct implementation after finding a recurrence.
	- It is more convenient on recursive structures like trees.
	- It only ever touches states that are necessary to compute, which can make it significantly faster for some problems.
- Bottom-up also has its own advantages.
	- Often, there are characteristics of the state space that allow for space optimisations only possible going bottom-up.
	- It also doesn't have the recursive overhead inherent to the top-down approach.
	- You usually more control, which is useful for more advanced techniques, e.g. speeding up the recurrence with a data structure.
- **Summary:** If you have a choice, pick your preference. However, for trees, we'll generally only do top down. And for many more advanced techniques, we'll probably only do bottom up.

### Dynamic Programming

Reminder: Algorithmic Complexity

dynamic programming? 2D DP Exponential DP

What is

DP with Data Structures More example problems

- Cool. Now we know what DP is (hopefully).
- The above helps you recognize and (hopefully) code a DP someone tells you.
- But all of this is not particularly useful for finding the right states or the right recurrence.
- What follows is a useful strategy to make these decisions, and some examples to demonstrate.
- But really, the only method that works for sure is practice.

Dynamic Programming

Reminder: Algorithmic Complexity

What is dynamic programming? 2D DP

Exponential

DP DP with Data Structures More example

problems

We'd like to choose a state which contains the minimum amount of information while letting us figure out what steps are valid as we build up from trivial subproblems to

To get a gauge of whether a problem is DP and what the DP might look like, it's often easier to start with the

the original problem.

recurrence rather than the state.

It's *not* expected that you'll pick the right state immediately. It's more a process of trial and error, *even if you are very experienced*.

- Dynamic Programming
- Reminder: Algorithmic Complexity
- What is dynamic programming?

2D DP

- Exponential DP DP with Data
- Structures More example problems
- E.g: If you need to output the best answer assuming you take *X* items, then number of items should probably be in your state.

Often implicit in the state, but a good starting point, since

<sup>1</sup> Choose some order to do the problem in. So essentially,

it strongly suggests what your state might be.

<sup>2</sup> Pick a tentative state. Initially, it should just contain the parameters necessary to determine the end result.

how are you going to build up your solution?

state.

to make a recurrence.

repeat this step.

### Dynamic Programming

- Reminder: Algorithmic Complexity
- What is dynamic programming? 2D DP
- Exponential DP
- DP with Data Structures More example

problems

<sup>4</sup> Repeat this until it stabilizes or you realise you should try something else.

<sup>3</sup> Test whether your state specification is sufficient by trying

Often you'll be unable to determine which moves are legal and which aren't, using only the information stored in your

This usually means that you need to add more information to the state. Add an extra parameter to address this, then

Dynamic Programming

Reminder: Algorithmic Complexity What is dynamic programming? 2D DP Exponential DP DP with Data Structures More example problems

- Now, you should at least have a DP algorithm.
	- Be happy about this, you've probably just changed something from exponential to polynomial.
		- Is it good enough though? **Calculate** your complexity.
		- What if it isn't? A few directions to go from here.

- Dynamic Programming
- Reminder: Algorithmic Complexity
- What is dynamic programming? 2D DP
- Exponential DP DP with Data Structures
- More example problems
- In particular, any recurrences that are ranges should make you think of *range tree*

Is everything in our state necessary? Can we determine the valid moves from a subset of the state? More difficult: can

<sup>1</sup> Look at your state. Is it bad? If so, can you fix this?

we move anything around to improve the state?

<sup>2</sup> Look at your recurrence. Is there some nice structure to it? If so, it is likely a suitable data structure will speed it up.

Maybe our order to start with was incorrect.

## Table of Contents 27

3 2D DP

4 Exponential DP

![](http://localhost:8000/api/lessons/Week_3/files/dynamic-programming-slides/images/_page_26_Figure_2.jpeg)

Dynamic Programming

Reminder: Algorithmic

Structures More example

problems

5 DP with Data Structures

1 Reminder: Algorithmic Complexity

2 What is dynamic programming?

6 More example problems

## Dynamic Programming in More Dimensions 28

### Dynamic Programming

Reminder: Algorithmic Complexity

What is dynamic programming? 2D DP

Exponential DP DP with Data

Structures More example problems

- All the DP problems we've seen so far have a simple, one-dimensional state.
- However, it is easy to extend DP to states of higher dimensions.
- The hardest part of finding a DP solution is usually identifying a state that makes sense for the problem, and more dimensions just add more possibilities.

### Dynamic Programming

Reminder: Algorithmic Complexity

What is dynamic programming?

2D DP Exponential DP

DP with Data Structures More example problems

**Problem Statement** To further your academic career, you have decided to steal some textbooks from the library. Unfortunately the bag you have brought is far too small, and won't fit all of the books.

There are *n* books, the *i*th has a given size *s<sup>i</sup>* and a value *v<sup>i</sup>* (representing how valuable it is to you). Your bag has a given maximum capacity *S*: the sizes of all the books you take with you must total less or equal to this. Security is coming, and you want to maximise the total value of the books you're taking. What is the maximum value you can fit in your bag?

**Constraints** 1 *≤ n ≤* 5000, 1 *≤ S ≤* 5000. 1 *≤ s<sup>i</sup> , v<sup>i</sup> ≤* 5000. All numbers are integers.

*n*

we put the books in the bag doesn't matter.

<sup>1</sup> The amount of space remaining in our bag

that would be *O*(2

we need to know?

bag

- Dynamic Programming
- Reminder: Algorithmic
- Complexity What is dynamic programming?
- 2D DP Exponential

DP

- DP with Data Structures
- More example problems
- If we order the books by their given numbers, we have an ordering for free: if we are up to book *i*, then we've already considered books 1 through *i −* 1, and not books *i* through *N*.

We can't try every possible selection of books, because

We can start optimising by first observing that the order

In order to place a book in our bag, what information do

<sup>2</sup> A guarantee that we haven't already put this book in our

) possibilities.

This suggests the state

(*i, j*)

### where:

Dynamic Programming

Reminder: Algorithmic Complexity What is dynamic programming? 2D DP Exponential DP DP with Data Structures More example problems

- *i* is the book we are currently considering,
- we have already considered all the books before *i*, and
- *j* is the amount of space used in the bag.
- We ask the question f(*i, j*): how much value can I fit into *j* units of space, using only books from 1 through *i*?
- Then f(*n, S*) will give the answer to the problem.
- Can we find a recurrence that answers this question in terms of smaller ones?

### Dynamic Programming

Reminder: Algorithmic Complexity

What is dynamic programming?

2D DP Exponential

DP

DP with Data Structures

More example problems

- f(*i, j*): how much value can I fit into *j* units of space, using only books from 1 through *i* inclusive?
- If we consider only book *i*, we have two choices:
	- If we put book *i* in our bag, we will use *s<sup>i</sup>* space and gain *v<sup>i</sup>* value. Then the best value we could make would be f(*i −* 1*, j − si*) + *v<sup>i</sup>* .
	- If we *don't* put book *i* in our bag, we will not use any space or gain any value. Then the best value we could make would be f(*i −* 1*, j*).
- Thus we obtain the recurrence

$$
f(i, j) = max(f(i-1, j-s_i) + v_i, f(i-1, j)).
$$

successful answers?

### Dynamic Programming

- Reminder: Algorithmic Complexity
- What is dynamic programming?
- 2D DP Exponential DP

problems

- DP with Data Structures More example
- f(*i,* 0) = 0 for all *i* (no space to put books in).

What about base cases that can actually result in

such an answer will ever be the best one.

Also, f(0*, j*) = 0 for all *j ≥* 0 (no books to get value from).

What if *j − s<sup>i</sup> <* 0? To simplify the recurrence, we can simply include in our base cases that f(*i, j*) = *−∞*

whenever *j <* 0, for all *i*. Then no solution that tries to use

are a total of *nS* states.

to calculate.

Dynamic Programming

Reminder: Algorithmic Complexity

What is dynamic programming? 2D DP

Exponential DP

DP with Data Structures More example

problems

Thus, the total time complexity of this algorithm is *O*(*nS*).

**Complexity** Our state includes two parameters, one with *n* possibilities and the other with *S* possibilities, so there

Each state checks a constant number (at most 2) other states to obtain an answer, so each state takes *O*(1) time

**Top-Down Implementation const int** *INF* = 1000\*1000\*1000+7; **const int** *UNKNOWN* = -1;

if (*i* == 0 || *j* == 0) { return 0; }

**const int** *N* = 5050, *MAXS* = 5050;

**int** *f*(**int** *i*, **int** *j*) { *// base cases* if (*j* < 0) return -*INF*;

*// check cache*

*// calculate answer*

**int** *solve* (**int** *n*, **int** *S*) {

### Dynamic Programming

Reminder: Algorithmic Complexity

dynamic programming? 2D DP

Exponential DP

What is

DP with Data Structures

More example problems

return *f*(*n*, *S*); }

}

This implementation reduces the need to bounds-check for the large number of base cases.

for (**int** *i* = 0; *i* <= *n*; *i*++) { *fill* (*cache*[*i*], *cache*[*i*]+*S*+1, *UNKNOWN*); }

**int** *cache*[*N*][*MAXS*]; *// initialise to -1 because 0 is a valid answer*

if (*cache*[*i*][*j*] != *UNKNOWN*) { return *cache*[*i*][*j*]; }

return *cache*[*i*][*j*] = *max*(*f*(*i*-1, *j*-*s*[*i*]) + *v*[*i*], *f*(*i*-1, *j*));

Dynamic Programming

Reminder: Algorithmic Complexity What is dynamic programming? 2D DP Exponential DP DP with Data Structures More example problems

- In a bottom-up implementation, we are responsible for scheduling the computations ourselves.
	- We need an order that respects the dependencies: each state depends on *i* which are *less* so increasing order of *i* works.
- Also, we need to bounds-check carefully now, to make sure we don't read outside our array.

### **Bottom-Up Implementation**

```
const int N = 5050, MAXS = 5050;
int dp[N][MAXS]; // zero -initialised; correct for i = 0 and j = 0
for (int i = 1; i <= n; i++) {
  // everything with smaller i will be solved by the time we get here
  for (int j = 1; j <= S; j++) {
    int m = dp[i-1][j]; // skip book i
    // take book i; bounds check to skip when array index is negative
    if (j - s[i] >= 0) { m = max(m, dp[i-1][j-s[i]] + v[i]); }
    dp[i][j] = m;
  }
}
```
### Table of Contents 37

![](http://localhost:8000/api/lessons/Week_3/files/dynamic-programming-slides/images/_page_36_Figure_2.jpeg)

# Exponential DP 38

DPs you are used to.

So your state space is 2*<sup>n</sup>*

the alternative.

- Dynamic Programming
- Reminder: Algorithmic Complexity
- What is dynamic programming?
- 2D DP Exponential DP
- DP with Data Structures More example

problems

Especially useful with NP-hard problems involving finding a permutation. TSP (Travelling Sales Person) is the most well-known such example.

Seems bad but still a lot better than *n*! which is usually

Sometimes your state needs to be much bigger than the

*·* (extra metadata).

A common trick is to make your state a set.

Practically, these problems can often be detected by having small bounds (e.g. *n ≤* 20).

# Exponential DP 39

is unwieldly and probably slow.

Instead we use a *bitset*.

set *{*0*,* 2*,* 3*,* 5*,* 6*}*.

- Dynamic Programming
- Reminder: Algorithmic Complexity
- What is dynamic programming?
- 2D DP
- Exponential DP

problems

- DP with Data Structures More example
- In this way, we can use an integer to index any subset of a set, amongst other things.

To represent our state, we don't store an actual set. This

A bitset is an integer which represents a set. The *i*th least significant bit is 1 if the *i*th element is in the set, and 0 otherwise. For example the bitset 01101101 represents the

This is much faster, especially if you use built-in bit operations to manipulate the set.

# Bitsets 40

programming? 2D DP Exponential DP DP with Data Structures

Dynamic Programming

Reminder: Algorithmic Complexity What is dynamic

More example problems

Singleton set: 1<<i Set complement: ~x

- Set intersection: x & y
- Set union: x | y
- Symmetric difference: x ^ y
- Membership test: x & (1<<i)

Useful operations for manipulating bitsets:

- Size of set
	- C++20, with <bit>: popcount(x)
	- before C++20, with GCC: \_\_builtin\_popcount(x)
- Least significant bit (or an arbitrary bit): x & (-x)
- Iterate over all sets and subsets:

```
// for all sets
for (int set = 0; set < (1<<n); set++) {
  // for all subsets of that set
  for (int subset = set; subset; subset = (subset -1) & set) {
    // do something with the subset
  }
}
```
### Dynamic Programming

Reminder: Algorithmic Complexity What is dynamic

2D DP Exponential DP DP with Data Structures More example problems

- programming? **Problem statement** You want to tile your roof with *n* tiles in a straight line, each of which is either black or white. Due to regulations, for every *m* consecutive tiles on your roof, at least *k* of them must be black. Given *n*, *m* and *k* (1 *≤ n ≤* 60, 1 *≤ k ≤ m ≤* 15, *m ≤ n*), how many valid tilings are there?
	- **Example** If *n* = 2, *m* = 2 and *k* = 1, there are 3 different tilings: BB, BW, or WB.

### Dynamic Programming

- Reminder: Algorithmic Complexity
- What is dynamic programming?
- 2D DP Exponential

problems

DP

- DP with Data Structures More example
- A counting problem, a bit different from what we might be used to. Our DP will associate with a state how many configurations correspond to that state. The rest (for now) will mostly be the same.
- Let's start with an obvious state. How about the number of valid tilings with *n* tiles. Then hopefully we can step to *n* + 1 by laying one more tile.
- Then our step is to lay either a black tile or white tile.
- But how do we know whether we can lay a white tile?
- We need to know if there are only *k −* 1 black tiles in the last *m −* 1 tiles. If so, the next tile must be black.
- We should add that to our state.

the last *m −* 1 are black.

black.

### Dynamic Programming

- Reminder: Algorithmic Complexity
- What is dynamic programming? 2D DP

### Exponential DP

- DP with Data Structures More example problems
- Then *dp*[*n*][*k −* 1] can be counted once (tile *n* + 1 is black only), and each *dp*[*n*][*j*] (*k ≤ j < m*) can be counted twice (tile *n* + 1 can be either colour).

Now our state is *n*, the number of tiles laid and *b*, the number of black tiles that are in the last *m −* 1 tiles.

We can now tell whether the *n* + 1-th tile is forced to be

Let *dp*[*n*][*b*] be the number of tilings of *n* tiles where *b* of

Counted towards what though? This is finding *dp*[*n* + 1], but we'll need all the *dp*[*n* + 1][*b*] values in the next round, and we haven't found those.

tiles in the last *m −* 1 are black.

stays the same?

### Dynamic Programming

- Reminder: Algorithmic Complexity
- What is dynamic programming? 2D DP

### Exponential DP

problems

- DP with Data Structures More example
- So we should amend our state to include *which* of the last *m −* 1 tiles are black, not just *how many*.

And because of this, in the next round we will need to

We need to know what the (*m −* 1)th tile was.

know what the (*m −* 2)th tile was, and so on.

There's a fundamental problem: we only store how many

But say we add a black tile to the right. Then how do we know if #(black tiles in the last m) increases or

Implementation is simpler if we just store the last *m*

- Let f(*i, S*) be the number of ways to have tiled the first *i* tiles, such that out of the last *m* tiles, the ones that are black are exactly the ones in the set *S*.
- For the recurrence, we can either set the new tile to be black or white. Reflecting this in our state is just applying the right bit operations from earlier.
- **Recurrence**

Dynamic Programming

Reminder: Algorithmic Complexity What is dynamic programming? 2D DP Exponential DP DP with Data Structures More example problems

$$
f(i, S) = f(i - 1, S >> 1) + f(i - 1, (S >> 1) | (1 << (m - 1))),
$$

where *|S| ≥ k*, or 0 otherwise. Tile (*i − m*) is white in the first term and black in the second.

**Base case** We have f(*m, S*) = 1 iff *|S| ≥ k*. We don't need to consider f(*i, S*) for any *i < m*.

### Dynamic Programming

Reminder: Algorithmic Complexity

What is dynamic programming?

2D DP Exponential DP

DP with Data Structures

More example problems

**Complexity** There are *O*(*n*2 *<sup>m</sup>*) total states to calculate, and each state takes *O*(1) to compute, so this algorithm runs in *O*(*n*2 *<sup>m</sup>*) time.

### **Implementation**

```
for (int set = 0; set < (1<<m); set++) {
  dp[m][set] = (popcount(set) >= k); // base case
}
for (int i = m+1; i <= n; i++) {
  fill(dp[i], dp[i] + (1<<m), 0);
  for (int set = 0; set < (1<<m); set++) if (popcount(set) >= k) {
    dp[i][set] = dp[i-1][set >>1]
               + dp[i-1][(set >>1)|(1<<(m-1))];
  }
}
long long ans = 0;
```
for (**int** *set* = 0; *set* < (1<<*m*); *set*++) { *ans* += *dp*[*n*][*set*]; }

) to use only *O*(2

dp[i%2][j] and so on.

f(*i −* 1*, S*

*′*

### Dynamic Programming

- Reminder: Algorithmic Complexity
- What is dynamic programming?

Exponential DP

2D DP

DP with Data Structures More example problems

can aggregate tilings into only 2*<sup>m</sup> ≤* 32*,* 768 groups based on how the last *m* tiles are placed.

**Moral** The brute force has 2*<sup>n</sup> ≈* 10<sup>18</sup> possibilities, but we

**Space Optimisation** We could also exploit the fact that the answer for f(*i, S*) only ever relies on the answers for

Simply replace all instances of dp[i][j] with

*<sup>m</sup>*) memory.

We don't care precisely how the tiles were placed long ago; only the last *m* can impact any future tile placements.

Dynamic Programming

Reminder: Algorithmic Complexity

What is dynamic programming? 2D DP

Exponential DP DP with Data

Structures More example problems

**Problem Statement:** Given a weighted, bidirectional graph with *n* nodes, find the length of the shortest path starting from node 0 that visits every node exactly once.

![](http://localhost:8000/api/lessons/Week_3/files/dynamic-programming-slides/images/_page_47_Picture_8.jpeg)

- **Sample Input:**
- **Sample Output:** 5, path is 0 *→* 1 *→* 2 *→* 3.

### Dynamic Programming

- Reminder: Algorithmic Complexity
- What is dynamic programming?
- 2D DP Exponential DP

problems

DP with Data Structures More example

- Let us try the problem in a natural order: increasing number of nodes on a path.
- So our state is (#nodes in path) and we store the shortest path with that many nodes.
- Then our recursion is …whoops, we need to know where we are as well.
- So let us amend the state, our state is (#nodes in path, last node in path).
- Then our recursion is to try every next node.
- But how do we know if we have visited a node twice?
- We have to keep this in our state …

We will denote this f(*S, e*).

came from:

a hope of forming a recurrence.

f(*S, e*) = min

### Dynamic Programming

- Reminder: Algorithmic Complexity
- What is dynamic programming?
- 2D DP Exponential DP DP with Data
- Structures More example problems
- Alternatively, it's more natural to push this forward and think of the next cities we can go to.

So our state is (S, e). We store the shortest path that starts at 0, ends at *e* and uses the nodes in *S* exactly once.

Now we know what next moves we can make. So we have

We could try considering all possible cities we could have

f(*S \ {e}, p*) + dist[*p*][*e*]

Exercise: Translate the above into bit operations.

*p∈S\{e}*

Dynamic

return *ans*;

Programming Reminder: Algorithmic Complexity What is dynamic programming? 2D DP Exponential DP DP with Data Structures More example problems #include <algorithm > **using namespace** *std*; **const int** *N* = 20; **const int** *INF* = 1*e9*; **int** *n*, *adj*[*N*][*N*]; *// assume this is given.* **int** *dp*[1<<*N*][*N*]; *// dp[x][i] is the shortest 0->i path visiting set bits of x* **int** *tsp* (**void**) { for (**int** *mask* = 0; *mask* < (1<<*n*); *mask*++) for (**int** *city* = 0; *city* < *n*; *city*++) { *dp*[*mask*][*city*] = *INF*; } *dp*[1][0] = 0; *// 1 represents seen set {0}* **int** *ans* = *INF*; for (**int** *mask* = 1; *mask* < (1<<*n*); *mask*++) *// for every subset of cities seen so far* for (**int** *cur* = 0; *cur* < *n*; *cur*++) { if (*mask* & (1<<*cur*)) { *// cur must be one of the cities seen so far* **int** *cdp* = *dp*[*mask*][*cur*]; *// distance travelled so far* if (*mask* == (1<<*n*) - 1) { *ans* = *min*(*ans*, *cdp*); } *// seen all cities // note we don't have to add adj[cur][0] to return to vertex 0* for (**int** *nxt* = 0; *nxt* < *n*; *nxt*++) if (!(*mask* & (1<<*nxt*))) { *// try going to a new city // new seen set is mask union {nxt}, and we will be at nxt // distance incurred to get to this state is now no worse than // cdp (current distance incurred) + edge from cur to nxt dp*[*mask*|(1<<*nxt*)][*nxt*] = *min*(*dp*[*mask*|(1<<*nxt*)][*nxt*], *cdp* + *adj*[*cur*][ *nxt*]); } } }

### Table of Contents 52

![](http://localhost:8000/api/lessons/Week_3/files/dynamic-programming-slides/images/_page_51_Figure_2.jpeg)

Dynamic Programming

6 More example problems

# DP with Data Structures 53

recursion is too high.

closely.

### Dynamic Programming

- Reminder: Algorithmic Complexity
- What is dynamic programming? 2D DP
- Exponential DP DP with Data
- Structures More example problems
- Often it can be sped up with the right choice of data structure.

Sometimes you have the right state space but the cost of

In such cases, examine the structure of the recurrence

One common example is when your recursion naturally involves a *range* query.

## DP with Data Structures 54

### Dynamic Programming

Reminder: Algorithmic Complexity What is dynamic programming? 2D DP Exponential DP DP with Data Structures More example problems

- You have already seen one example of this: LIS.
- The recurrence we end up with by going left to right is

best[*i*] = 1 + max bestWithEnd[0*, a*[*i*])*.*

Note in LIS, it was not clear from the outset that a range tree would play a role. You had to write down the recurrence to see it.

Dynamic Programming

Reminder: Algorithmic Complexity

dynamic programming? 2D DP Exponential DP

What is

DP with Data Structures More example problems

**Problem statement** You have *n* fireworks available to you. Each firework has a position *x<sup>i</sup>* on the horizon, a *combo range* [*l<sup>i</sup> ,ri* ] and a score *s<sup>i</sup>* .

You can enable or disable each firework. Enabled fireworks will be launched and contribute their score to the total. However, a firework can only be launched if its combo range includes the position of the *most recent* firework to be launched.

The fireworks are specified in order of firing time. You *cannot* change this order.

What is the maximum total score you can obtain?

**Constraints** 1 *≤ n ≤* 100*,* 000, 1 *≤ x<sup>i</sup> ≤* 500*,* 000.

restricting the combo range.

any of the others.

### Dynamic Programming

- Reminder: Algorithmic Complexity
- What is dynamic programming? 2D DP

Exponential DP

problems

DP with Data Structures More example

The only firework before it (the first one) lies outside its combo range.

However, we could never launch the second firework with

For example, suppose we had three fireworks located at positions 1, 2 and 3 in that order, and that their combo

We can make a fireworks display with any individual firework, because there would be no previous firework

ranges were [1*,* 5], [3*,* 5] and [0*,* 1] respectively.

On the other hand, its position is not within the combo range of the only firework after it (the third one).

### Dynamic Programming

Complexity What is dynamic programming? 2D DP Exponential DP DP with Data Structures More example problems

- Reminder: Algorithmic Due to the firing order specified in the problem, we have a natural order to start with.
	- Then the obvious state to start with is just the last firework we've launched. For each firework, we store the highest obtainable total with a chain ending at that firework.
	- Suppose that for each previous firework, we have the best total from a chain of zero or more fireworks leading up to it. Now we want to pick the best eligible previous firework.
	- 'Eligible' here enforces that the previous firework has to be inside our combo range.

### Dynamic Programming

Reminder: Algorithmic Complexity

What is dynamic programming?

2D DP Exponential DP

DP with Data Structures

More example problems

**Top-Down Implementation**

```
int
     f
       (int
              i) {
  if
       (
        i == 0) return 0;
  if
       (cache
               [
                 i]) return cache
                                       [
                                         i];
  int
        m
           =
              s
               [
                 i];
  for
        (int
               j = 1;
                         j
                            <
                               i
                                ;
                                   j++) {
     if
         (
           x
            [
              j] >=
                      l
                        [
                         i] &&
                                  x
                                   [
                                     j] <=
                                             r
                                              [
                                                i]) {
        m
           = max
                  (
                   m
                     ,
                        f
                         (
                           j) +
                                  s
                                   [
                                     i]);
     }
  }
  return cache
                   [
                     i] =
                            m
                             ;
}
```
### **Bottom-Up Implementation**

```
ll res = 0;
for
     (int
           i = 1;
                    i <=
                           n
                            ;
                               i++) {
  dp
     [
      i] =
             s
              [
               i];
  for
       (int
              j = 1;
                       j
                          <
                            i
                              ;
                                j++) {
     // try the jth as the penultimate firework
     if
         (
          x
           [
             j] >=
                    l
                      [
                       i] &&
                               x
                                [
                                  j] <=
                                         r
                                           [
                                            i]) {
       dp
          [
           i] = max
                      (dp
                          [
                           i], dp
                                   [
                                    j] +
                                           s
                                            [
                                             i]);
     }
  }
  // update answer
  res
       = max
              (res
                   , dp
                        [
                          i]);
}
```
### Dynamic Programming

Reminder: Algorithmic Complexity What is dynamic programming? 2D DP Exponential DP DP with Data Structures More example problems

- We have *n* states to calculate, and each one takes *O*(*n*) time.
	- This is an *O*(*n* 2 ) algorithm, and with *n* up to 100,000, this is not going to run in time.
	- It seems unlikely that we can change the state space to be anything other than linear, but the recurrence looks simple enough.
	- What is the actual recurrence?

This is a *range* constraint.

- Dynamic Programming
- Reminder: Algorithmic Complexity
- What is dynamic programming?
- 2D DP Exponential

DP

DP with Data Structures More example

problems

So we should be able to query this maximum using a range tree, and obtain a better solution!

where the maximum is zero if no such *j* exists.

**Recurrence** Let f(*i*) be the best score possible ending at

f(*i*) = *s<sup>i</sup>* + max*{*f(*j*) *| j < i, l<sup>i</sup> ≤ x<sup>j</sup> ≤ ri},*

the *i*th firework (in the given order). Then

There are still *n* states, but now each one takes only *O*(log *n*) time to calculate, so we obtain a solution in *O*(*n* log *n*) time.

Dynamic Programming

Reminder: Algorithmic Complexity What is dynamic programming? 2D DP Exponential DP DP with Data Structures More example problems

### **Bottom-Up Implementation**

```
int query(int a, int b); // max query range tree of size 500,000
int update(int a, int v); // update index a to value v
ll res = 0;
for (int i = 1; i <= n; i++) {
  // calculate best score ending in i-th firework using the range tree
  dp[i] = query(l[i], r[i] + 1) + s[i];
  // add i-th firework to RMQ
  update(x[i], dp[i]);
  // update final answer if necessary
  res = max(res, dp[i]);
}
```
A top-down implementation is not as easy to come up with in this case. Why?

Dynamic Programming

Reminder: Algorithmic Complexity

dynamic programming? 2D DP Exponential

What is

DP

DP with Data Structures More example

problems

real line 0*,* 1*, . . . n*. You are given *m* segments, each with a range [*s<sup>i</sup> , ei* ] and a cost *c<sup>i</sup>* .

**Problem Statement:** Consider the *n* + 1 points on the

Output the minimum cost necessary to obtain a subset of the segments which covers all *n* + 1 points.

**Input Format:** First line, *n, m*. 1 *≤ n, m ≤* 100*,* 000. The following *m* lines describe a segment as a triple (*s<sup>i</sup> , ei , ci*).

Dynamic Programming

Reminder: Algorithmic Complexity

What is dynamic programming? 2D DP Exponential DP

Structures More example problems

# **Sample Input:**

5 4

0 5 10 0 3 4

2 5 4

0 4 5

DP with Data **Sample Output:**

8

**Explanation:** Take the second and third segments.

- Dynamic Programming
- Reminder: Algorithmic Complexity
- What is dynamic programming?
- Exponential DP

2D DP

DP with Data Structures More example

problems

- What order should we attempt the problem in?
- Let's try just processing the segments one by one.
- What is the state?
- To answer the question, we need to store what indices we have covered.
- Okay, that's a bit excessive.
- **Note:** There was nothing special about the order of the segments, we essentially processed the segments in an arbitrary order.
- It is generally better to at least have some meaningful order.

- Dynamic Programming
- Reminder: Algorithmic Complexity What is dynamic programming?
- Exponential DP DP with Data Structures

More example problems

2D DP

- Alternatively, we can focus on the array.
- Then a natural order is left to right.
- But what would our state be then? This is less obvious.
- A first guess would be *i*, where we are up to, and *S* which indices to the left of *i* are covered.
- But this just gets us back to where we started.
- The **key** here is to make the state just *i*. Then we denote *dp*[*i*] to be the min cost of segments to cover *exactly* [0*, i*].

recursion?

Let's just try!

our set of segments?

- Dynamic Programming
- Reminder: Algorithmic Complexity
- What is dynamic programming?
- 2D DP Exponential

DP

DP with Data Structures More example

problems

We need to pick a segment ending at *i* + 1! (Note, we are defining *dp*[*i*] to be the min cost to cover *exactly* [0*, i*]. So we ignore segments ending past *i* + 1)

We need to cover index *i* + 1. What does this mean for

A very reasonable question is, is this enough to form a

So we now have our choices. How do we form the recurrence?

To go from *i* to *i* + 1 what do we need to do?

- Dynamic Programming
- Reminder: Algorithmic Complexity
- What is dynamic programming?
- 2D DP Exponential

DP

- DP with Data Structures
- More example problems
- Far too slow.

Complexity appears to be *O*(*n*

for each segment, calculate this min.

State space is probably optimal already, so try to speed up the recurrence.

*j∈*[*s−*1*,i*]

*dp*[*j*]

<sup>2</sup>*m*): for each point *i* + 1,

Let's say we pick segment [*s, i* + 1] with cost *c*. What do

**Answer:** They must cover a range [0*, e*] where *e ≥ s −* 1.

*dp*[*i* + 1] = *c* + min

the rest of our segments have to satisfy?

So assuming we pick this segment, we have

Recurrence:

Dynamic Programming

Reminder: Algorithmic Complexity What is dynamic programming? 2D DP Exponential DP DP with Data Structures More example problems

$$
dp[i+1] = c + \min_{j \in [s-1, i]} dp[j]
$$

- **Observation:** We don't have to try all segments, just the ones ending at *i* + 1.
- Preprocessing segments by endpoint reduces the time complexity to *O*(*nm*):
	- For each point *i* + 1, for each segment *ending here*, calculate the min.
	- The min is only calculated once per segment.
- Getting closer, but still too slow.

Recurrence:

Dynamic Programming

Reminder: Algorithmic Complexity What is dynamic programming? 2D DP Exponential DP DP with Data Structures More example problems

$$
dp[i+1] = c + \min_{j \in [s-1,j]} dp[j]
$$

- **Observation:** This min is another *range* query!
- So we would hope we can support this with a range tree!
- Range min tree
	- Like LIS, range tree over *values dp*[*j*] not indices *j*
	- Default value should 'lose' to any other value, so pick *∞* rather than 0.

*// to be continued*

DP

![](http://localhost:8000/api/lessons/Week_3/files/dynamic-programming-slides/images/_page_69_Figure_2.jpeg)

**Implementation (continued)** for (**int** *i* = 0; *i* <= *n*; *i*++) { *dp*[*i*] = *INF*;

*update*(*i*, *dp*[*i*]);

*cout* << *dp*[*n*] << '\n';

for (**auto** *seg* : *segments*[*i*]) {

*ll prevcost* = *seg*.*first* == 0 ? 0 : *query*(*seg*.*first* -1, *i*);

*dp*[*i*] = *min*(*dp*[*i*], *prevcost* + *seg*.*second*);

Dynamic Programming

Reminder: Algorithmic Complexity

What is dynamic programming?

2D DP Exponential

DP

DP with Data Structures

problems

More example }

}

}

- Dynamic Programming
- Reminder: Algorithmic Complexity
- dynamic programming? 2D DP

What is

- Exponential DP DP with Data Structures
- More example problems
- approach.

**Exercise:** An alternative is to make *dp*[*i*] the min cost for covering **at least** [0*, i*]. Work out the details for this

A key was to be clear what the state represented.

Complexity? *O*((*n* + *m*) log *n*): make *m* range queries and

There are many problems along these lines, of doing DP on a line with choices given by intervals. It shouldn't be a

*n* point updates to a range tree of size *O*(*n*)

surprise many involve range trees.

**Exercise:** What changes if we require the intervals to cover the entire interval [0*, n*] not just the integer parts?

### Table of Contents 73

3 2D DP

4 Exponential DP

1 Reminder: Algorithmic Complexity

2 What is dynamic programming?

![](http://localhost:8000/api/lessons/Week_3/files/dynamic-programming-slides/images/_page_72_Figure_2.jpeg)

Dynamic Programming

6 More example problems

5 DP with Data Structures

restrictions are:

building?

- Dynamic Programming
- Reminder: Algorithmic Complexity
- dynamic programming? 2D DP

What is

Exponential DP DP with Data

problems

- Structures More example
- **Input:** First line 2 integers, *H, W*. 1 *≤ H, W, ≤* 1000. Next *H* lines each have *W* integers, the value of the cells. These values can be negative.

What is the maximum possible sum of values of a valid

**Problem Statement:** You have a *H × W* block of marble, divided into 1 *×* 1 cells. Each cell has a value. You want

Each cell of the building must lie on either the ground or

The cells chosen for the building for each of the *H* rows

to pick a subset of cells to make a building. The

another cell of the building.

must be contiguous.

**Source:** Australian Informatics Invitational Olympiad 2014.

Dynamic Programming

Reminder: Algorithmic Complexity

dynamic programming? 2D DP

What is

Exponential DP DP with Data Structures

More example problems

### **Sample Output:**

**Sample Input:**

-9 1 -9 1 1 1 -9 1 1 1 1 1

7

3 4

**Explanation:** Pick all 4 cells in the bottom row, the left 2 in the second row and just the 2nd in the third row.

at and start from there.

by cell.

within each row.

- Dynamic Programming
- Reminder: Algorithmic Complexity
- What is dynamic programming? 2D DP
- Exponential DP DP with Data
- Structures More example problems
- So our state is cell we are considering.
- And our choice needs to be whether to put the next cell into the building.

This is less obviously DP. Let's just pick something to look

One natural starting point is to consider the problem cell

What order? Let's say bottom to top, and left to right

But how do we know if we can include the next cell?

Dynamic Programming

Reminder: Algorithmic Complexity What is dynamic programming? 2D DP Exponential DP DP with Data Structures More example problems

- Okay, our state is too small, what do we need to add?
	- What cells on the previous row are in our building.
	- Something about what cells in our current row are in our building. **Why?**
	- Actually we need to store exactly what cells in our current row are in our building.
- What is the size of our state space now?
- Depends a bit on the implementation. Maybe something like *O*(*WH · W*<sup>2</sup> *· W*<sup>2</sup> ).
- This is a problem. We can optimize the recurrence but if our state space is too large we are just dead in the water.

Let's try a different state.

can do a row at a time.

- Dynamic Programming
- Reminder: Algorithmic Complexity
- dynamic programming? 2D DP Exponential

What is

DP with Data Structures

DP

- More example problems
- So instead of having *O*(1) moves, our moves are "pick a contiguous selection of cells on this row and put it in our building".

Instead of building cell by cell, let's build row by row.

We can note that each row is very structured, perhaps we

What is our state? How do we know if a move is valid?

How big is our state?

).

*O*(*H · W*<sup>2</sup>

- Dynamic Programming
- Reminder: Algorithmic Complexity
- What is dynamic programming?
- 2D DP Exponential DP
- DP with Data Structures
- More example problems
	- Still a bit too large but this is progress. It is possible to speed up the recurrence to *O*(1) so we are nearly there.

We need to know if the segment we have chosen lies within the segment of the building on the previous row.

So our state should be what row we are up to and what

cells in the previous row are in the building.

can make the state space.

### Dynamic Programming

- Reminder: Algorithmic Complexity
- What is dynamic programming?
- 2D DP Exponential DP
- DP with Data Structures
- More example problems
- Let's go back to the drawing board.

Each of the parameters is necessary.

If you were solving the problem yourself, you would probably keep trying this direction for a while.

But ultimately, it seems this is the limit of how small we

We probably need to pick a different direction for our DP.

**Draw things!**

building column by column.

cells for each column.

in terms of its columns?

### Dynamic Programming

- Reminder: Algorithmic Complexity
- What is dynamic programming?
- Exponential DP

2D DP

- DP with Data Structures More example
- problems
- **Key Observation:** It is ternary! The building increases height up to a point then decreases in height.

What is our state? How do we know a move is valid? Boils down to, what are the constraints for a valid building

Let's try going left to right. So we are now making our

What are our moves? Same as before, let's try picking the

are up to.

### Dynamic Programming

- Reminder: Algorithmic Complexity
- What is dynamic programming? 2D DP
- Exponential DP DP with Data
- Structures More example problems
- What do we need to store to know this?

height from the previous column.

Okay, our state is now (current column, height of current column).

Is this enough to know which moves we can make?

No. We don't even know if the building increased in

**Key Observation:** It is ternary! The building increases

Okay, let us start with the obvious state, which column we

height up to a point then decreases in height.

- Dynamic Programming
- Reminder: Algorithmic
- Complexity What is dynamic
- programming? 2D DP
- Exponential DP DP with Data
- Structures
- More example problems
- New state:

Is this enough?

State:

move?

(current column, height of current column, has the height of the building ever decreased?)

No. Not enough. We need to know if at least once in the

**Key Observation:** It is ternary! The building increases

(current column, height of current column).

Note: It is always okay to decrease in height. But if our move increases the height, how do we know if it is a valid

height up to a point then decreases in height.

past our building has decreased in height.

### Dynamic Programming

Reminder: Algorithmic Complexity What is dynamic programming? 2D DP Exponential DP DP with Data Structures More example problems

- **Key Observation:** It is ternary! The building increases height up to a point then decreases in height.
	- State:

(current column, height of current column, has the height of the building ever decreased?)

- Is this enough?
- It is enough to tell us what moves are valid in the current column.
- What is the state space?
- *O*(*WH*).
- So we should be optimistic. So we should try to define a recurrence.

Dynamic Programming

Reminder: Algorithmic Complexity What is dynamic programming? 2D DP Exponential DP DP with Data Structures More example problems

### State:

(current column, height of current column, has the height of the building ever decreased?)

- Let f(*w, h, b*) be the best building up to and including column *w*, with *h* cells picked in column *w* and *b* = 1 iff the height of the building has decreased at some stage.
	- Recurrence? Try *b* = 0 and *b* = 1 separately.

For *b* = 0. We can't decrease in height from our previous column and we can't ever have decreased in height in the past.

$$
f(w, h, 0) = \max_{h' \leq h} f(w - 1, h', 0) + \sum_{i=0}^{h} b[w][i]
$$

where we say f(*w −* 1*, −*1*,* 0) = 0 for convenience.

For *b* = 1. Then due to the ternary condition we can't increase from our previous column.

$$
f(w, h, 1) = \max_{h' \ge h, b' \in \{0, 1\}} f(w - 1, h', b') + \sum_{i=0}^{h} b[w][i]
$$

Complexity?

Dynamic Programming

Reminder: Algorithmic Complexity What is dynamic programming? 2D DP Exponential DP DP with Data Structures More example problems

> *O*(*WH*) state space, *O*(*H*) recurrence. Overall *O*(*WH*<sup>2</sup> ).

Dynamic Programming

Reminder: Algorithmic Complexity What is dynamic programming? 2D DP Exponential DP DP with Data Structures More example problems

- But state space is good, we can hope to speed up the recurrence.
	- Let's take a look at it. Let's try *b* = 0.

$$
f(w, h, 0) = \max_{h' \leq h} f(w - 1, h', 0) + \sum_{i=0}^{h} b[w][i]
$$

- This looks relatively structured. **Why?**
- Everything is a range!
- The first part is a range max. We know how to do these.
- The second part is a range sum of input. We can precompute this. **How?**
- So we should be able to do *O*(*WH* log *H*).

- A bit overkill it turns out. Here's a useful trick.
- Let's look at it again:

Dynamic Programming

Reminder: Algorithmic Complexity What is dynamic programming? 2D DP Exponential DP DP with Data Structures More example problems

$$
f(w, h, 0) = \max_{h' \leq h} f(w - 1, h', 0) + \sum_{i=0}^{h} b[w][i]
$$

- If we fix both *w* and *h*, it takes *O*(*H*) time to compute the max in the first term of f(*w, h,* 0).
- However, if we fix only *w*, and consider *h* = 0*,* 1*, . . . , H* together, we see that each max takes only *O*(1). **Why?**
- Because from f(*w, h,* 0) to the next subproblem f(*w, h* + 1*,* 0), the max only grows by one term:

$$
\max_{h' \leq h+1} f(w-1,h',0) = \max(\max_{h' \leq h} f(w-1,h',0), f(w-1,h+1,0)).
$$

This reduces complexity to *O*(*WH*).

- Recap. Our state: f(*w, h, b*).
- Recurrences:

Dynamic Programming

Reminder: Algorithmic Complexity What is dynamic programming? 2D DP Exponential DP DP with Data Structures More example problems

$$
f(w, h, 0) = \max_{h' \leq h} f(w - 1, h', 0) + \sum_{i=0}^{h} b[w][i]
$$
  

$$
f(w, h, 1) = \max_{\substack{h' \geq h \\ b' \in \{0, 1\}}} f(w - 1, h', b') + \sum_{i=0}^{h} b[w][i]
$$

- We speed up the sums by precomputing a cumulative sum for each column. We speed up the maxes by doing them iteratively per column.
- *O*(*WH*) states with recursion cost *O*(*H*) per column, hence overall recursion cost *O*(*WH*).

Dynamic Programming

Reminder:

What is dynamic

2D DP

Structures

problems

DP

Algorithmic Complexity programming? Exponential DP with Data More example #include <algorithm > #include <iostream > #include <vector> **using namespace** *std*; **const int** *N* = 1000; **const long long** *INF* = (1*ll* << 60); *// input and precomp.* **int** *W*, *H*; **long long** *b*[*N*][*N*]; *//(w,h)* **long long** *columnsum*[*N*][*N*]; **long long** *dp*[*N*][*N*][2]; *// (w,h,b)* **void** *precomp*() { *// TODO: read input here.* for (**int** *w* = 0; *w* < *W*; *w*++) { *// prefix sums for each column* for (**int** *h* = 0; *h* < *H*; *h*++) { *dp*[*w*][*h*][0] = *dp*[*w*][*h*][1] = -*INF*; *columnsum*[*w*][*h*] = *b*[*w*][*h*]; if (*h* > 0) { *columnsum*[*w*][*h*] += *columnsum*[*w*][*h*-1]; } } } }

| problems |                                  |
|----------|----------------------------------|
|          |                                  |
|          |                                  |
|          |                                  |
|          |                                  |
|          | }                                |
|          |                                  |
|          |                                  |
|          | }                                |
|          |                                  |
|          |                                  |
|          | cout<br><<<br>ans<br><<<br>'\n'; |
|          |                                  |
|          |                                  |
|          | }                                |
|          |                                  |
|          |                                  |
|          |                                  |
|          |                                  |
|          |                                  |
|          |                                  |
|          |                                  |
|          |                                  |
|          |                                  |
|          |                                  |

}

Let's summarize.

Dynamic Programming

Reminder: Algorithmic Complexity What is dynamic programming? 2D DP Exponential DP DP with Data Structures More example problems

- The problem seems difficult and convoluted. But the solution is quite natural, except looking left to right and characterizing the condition for going left to right.
- Even for that part, it is always worth making examples and trying different orders.
- Our choice of state space was (mostly) dictated just by the order we picked.
- Our recurrences followed through by translating our requirement.
- Speeding up the recurrence is natural from looking at the formula.
- **Moral (hopefully):** None of this is magic. Almost all of it is fairly logical.

- Dynamic Programming
- Reminder: Algorithmic Complexity
- What is dynamic programming? 2D DP
- Exponential DP
- DP with Data Structures
- More example problems
- **Problem statement** You have a set of *n* (1 *≤ n ≤* 1000) rows from a *n × n* chessboard, with some of the squares cut out from the right. How many ways are there to place *k* rooks on this chessboard without any rook threatening any other rook, modulo 10<sup>9</sup> + 7?

![](http://localhost:8000/api/lessons/Week_3/files/dynamic-programming-slides/images/_page_92_Figure_9.jpeg)

![](http://localhost:8000/api/lessons/Week_3/files/dynamic-programming-slides/images/_page_93_Figure_2.jpeg)

Reminder: Algorithmic Complexity

What is dynamic programming?

2D DP Exponential

DP DP with Data

Structures More example

problems

![](http://localhost:8000/api/lessons/Week_3/files/dynamic-programming-slides/images/_page_93_Figure_9.jpeg)

*n* = 4*, k* = 4: 8 ways

Let us pick an order.

Dynamic Programming

Reminder: Algorithmic Complexity What is dynamic programming? 2D DP Exponential DP DP with Data Structures More example problems

- Top row to bottom row seems natural.
- Then our state is which row we are up to, and we will store the number of ways to place rooks up to this row.
- Our moves are to try all places we can put a rook on the curent row.
	- How do we know if a move is valid?

columns in our state.

- Dynamic Programming
- Reminder: Algorithmic Complexity
- dynamic programming? 2D DP

What is

- Exponential DP
- DP with Data Structures
- More example problems
- About *O*(2 *<sup>m</sup> · n*), not good enough.

We can use a bitset like before.

How large is the state space?

In other words, how do we know which columns are free?

We don't know this. So we need to keep the set of free

Can we fix this?

- Dynamic Programming
- Reminder: Algorithmic Complexity
- What is dynamic programming?
- Exponential DP

2D DP

DP with Data Structures More example

problems

**Key Observation:** There was nothing special about the ordering of rows in this problem. Usually the order is suggested by the problem but in this case, there is no reason to have the rows in the order they are in.

But we are counting things. Can we instead just store the number of rooks we've placed. Then hopefully the number

Alas, we don't know whether the rooks we've placed are in

of ways we can place a rook on our new row is (length of row) - (#rooks placed).

a column we can place to or not.

![](http://localhost:8000/api/lessons/Week_3/files/dynamic-programming-slides/images/_page_97_Figure_2.jpeg)

Reminder: Algorithmic Complexity

What is dynamic programming?

2D DP Exponential DP

DP with Data

Structures More example problems

![](http://localhost:8000/api/lessons/Week_3/files/dynamic-programming-slides/images/_page_97_Figure_8.jpeg)

*n* = 4*, k* = 4: 8 ways

non-decreasing

### Dynamic Programming

- Reminder: Algorithmic Complexity
- What is dynamic programming? 2D DP
- Exponential DP
- DP with Data Structures More example
- problems
- Now, we know that if we place a rook on a row, we know that we can assume that every previously placed rook is in a cell that our row covers

Let's sort the sequence, so that the size of each row is

### Dynamic Programming Reminder: Algorithmic Complexity What is dynamic programming? 2D DP Exponential DP with Data Structures More example Example problem: Rooks 100 R R R This never happens!

DP

problems

### Dynamic Programming

- Reminder: Algorithmic Complexity
- What is dynamic programming? 2D DP
- Exponential DP DP with Data Structures
- More example problems
- If we're on a row *i* of length *l<sup>i</sup>* , then for every configuration of the rows above with *j* rooks already placed, we can place a rook for this row in (*l<sup>i</sup> − j*) places

Now, we can say that any rooks already placed will be

We can then formulate a recurrence that only needs to know about the current row and the number of rooks

either to the left or directly above us

**Recurrence**

### Dynamic Programming

Reminder: Algorithmic Complexity

What is dynamic programming? 2D DP

Exponential DP DP with Data

Structures More example

problems

**Base case** The number of ways to place 0 rooks on 0 rows is 1 (*not* 0).

**Subproblems** Let f(*i, j*) be the number of ways to place *j*

f(*i, j*) = f(*i −* 1*, j*) + f(*i −* 1*, j −* 1) *×* (*l<sup>i</sup> −* (*j −* 1))

rooks on the first *i* rows, sorted by length.

| problems |                                            |
|----------|--------------------------------------------|
|          |                                            |
|          | dp[i][j]<br>%=<br>MOD;                     |
|          | }<br>}                                     |
|          |                                            |
|          | cout<br><<<br>dp[n][k]<br><<<br>endl;<br>} |
|          |                                            |

### Dynamic Programming

Reminder: Algorithmic Complexity What is dynamic programming? 2D DP Exponential DP DP with Data Structures More example problems

- This time around, the magic was in reordering the rows.
- This **is** magic. But this general idea is very useful. If you aren't given an order, make an order. It can't be worse than having no order.
- You see a similar idea in 0-1 knapsack. To avoid storing a bitset of used items, we just pick any arbitrary order to process the items in.

### Dynamic Programming

Reminder: Algorithmic Complexity What is dynamic programming? 2D DP Exponential DP DP with Data Structures More example problems

- Another path to a solution is to do the problem in column order.
	- But you have to do it from right to left.
	- Then you get the same property as this solution, without sorting.
	- Note: column order isn't symmetrical as all rows are required to start from column 0.