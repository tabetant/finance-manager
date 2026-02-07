import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { courses, modules, quizzes } from '../app/db/drizzle/schema';
import 'dotenv/config';

// Run with: npx tsx src/db/seed.ts

const runSeed = async () => {
    if (!process.env.DATABASE_URL) {
        throw new Error('DATABASE_URL is not defined');
    }

    const client = postgres(process.env.DATABASE_URL);
    const db = drizzle(client);

    console.log('Seeding courses...');

    // 1. Calculus
    await db.insert(courses).values({
        id: 'calculus',
        title: 'Calculus',
        description: 'Explore the mathematics of change and motion.',
        iconName: 'calculator',
    }).onConflictDoNothing();

    // 2. Linear Algebra
    await db.insert(courses).values({
        id: 'linear-algebra',
        title: 'Linear Algebra',
        description: 'Understand vector spaces and linear mappings.',
        iconName: 'activity',
    }).onConflictDoNothing();

    console.log('Seeding Calculus modules & quizzes...');

    const calculusModules = [
        {
            title: 'Limits and Continuity',
            order: 1,
            youtube: 'https://www.youtube.com/embed/kfF40MiS7zA',
            content: `
# Limits and Continuity

**Limits** are the foundational building block of calculus. They describe the behavior of a function as its input approaches a specific value, regardless of whether the function is strictly defined at that point.

## Approaching Values
Imagine a bug walking along the curve of a function $f(x)$. As the bug gets closer and closer to $x=c$ from both the left and right sides, the height of the bug represents the limit $L$. We write this as:
$$ \lim_{x \to c} f(x) = L $$

## Continuity vs. Discontinuity
A function is **continuous** at a point if:
1. The function is defined at that point.
2. The limit exists as you approach that point.
3. The limit equals the function's value.

If any of these conditions fail, we have a **discontinuity** (like a hole, a jump, or a vertical asymptote).
            `,
            quizzes: [
                { question: "What condition is NOT required for a function to be continuous at x=c?", options: ["f(c) is defined", "Limit exists as x approaches c", "The derivative exists at c", "The limit equals f(c)"], correct: "The derivative exists at c" },
                { question: "If the limit from the left does not equal the limit from the right, what exists at that point?", options: ["A jump discontinuity", "A hole", "A vertical asymptote", "Continuous point"], correct: "A jump discontinuity" },
                { question: "Can a limit exist at a point where the function is undefined?", options: ["Yes", "No"], correct: "Yes" }
            ]
        },
        {
            title: 'Power and Product Rules',
            order: 2,
            youtube: 'https://www.youtube.com/embed/9vKqVkMQHKk',
            content: `
# Differentiation Rules

Finding derivatives using the limit definition is tedious. Thankfully, we have shortcuts!

## The Power Rule
For any real number $n$, if $f(x) = x^n$, then:
$$ f'(x) = n \cdot x^{n-1} $$
*Example:* The derivative of $x^3$ is $3x^2$.

## The Product Rule
If you have a function that is the product of two other functions, $h(x) = f(x) \cdot g(x)$, you cannot just multiply their derivatives. Instead, you use:
$$ h'(x) = f'(x)g(x) + f(x)g'(x) $$
"Left d-Right plus Right d-Left".
            `,
            quizzes: [
                { question: "What is the derivative of x^5?", options: ["5x^4", "x^4", "5x^5", "4x^5"], correct: "5x^4" },
                { question: "Which rule is used for f(x) = u(x) * v(x)?", options: ["Chain Rule", "Product Rule", "Quotient Rule", "Power Rule"], correct: "Product Rule" },
                { question: "What is the derivative of a constant (e.g., f(x) = 7)?", options: ["7", "1", "0", "Undefined"], correct: "0" }
            ]
        },
        // ... Optimization and Integration would follow similar patterns
        {
            title: 'Optimization',
            order: 3,
            youtube: '',
            content: `
# Optimization

Optimization is one of the most practical applications of calculus. It involves finding the maximum or minimum values of a function to solve real-world efficiency problems.

## Local Extrema
To find the peaks (maxima) and valleys (minima), we look for **critical points** where the derivative is either zero or undefined.
1. Take the derivative $f'(x)$.
2. Set $f'(x) = 0$ and solve for $x$.
3. Test these points to see if they are maximums or minimums.
            `,
            quizzes: [
                { question: "What is the slope of the tangent line at a local maximum?", options: ["Positive", "Negative", "Zero", "Undefined"], correct: "Zero" },
                { question: "Optimization involves finding:", options: ["Limits", "Extrema", "Integrals", "Continuity"], correct: "Extrema" },
                { question: "If f'(x) goes from positive to negative at c, then f(c) is a:", options: ["Local Maximum", "Local Minimum", "Inflection Point", "None"], correct: "Local Maximum" }
            ]
        },
        {
            title: 'Integration Basics',
            order: 4,
            youtube: '',
            content: `
# Integration Basics

Integration is essentially the reverse of differentiation. It is often called finding the "antiderivative".

## Area Under a Curve
Geometrically, the definite integral $\int_{a}^{b} f(x) dx$ represents the net signed area between the function $f(x)$ and the x-axis from $x=a$ to $x=b$.

## The Fundamental Theorem of Calculus
This theorem connects differentiation and integration, stating that if $F$ is the antiderivative of $f$, then:
$$ \int_{a}^{b} f(x) dx = F(b) - F(a) $$
            `,
            quizzes: [
                { question: "What does a definite integral represent?", options: ["Slope", "Area under curve", "Rate of change", "Limit"], correct: "Area under curve" },
                { question: "Integration is the inverse operation of:", options: ["Limits", "Differentiation", "Algebra", "Trigonometry"], correct: "Differentiation" },
                { question: "The notation 'dx' in an integral represents:", options: ["Difference in x", "Derivative of x", "Infinitesimal width", "Variable"], correct: "Infinitesimal width" }
            ]
        }
    ];

    for (const mod of calculusModules) {
        const [insertedModule] = await db.insert(modules).values({
            courseId: 'calculus',
            title: mod.title,
            orderIndex: mod.order,
            contentMarkdown: mod.content,
            youtubeUrl: mod.youtube,
        }).returning({ id: modules.id });

        if (mod.quizzes) {
            for (const q of mod.quizzes) {
                await db.insert(quizzes).values({
                    moduleId: insertedModule.id,
                    question: q.question,
                    options: q.options,
                    correctAnswer: q.correct,
                });
            }
        }
    }

    console.log('Seeding Linear Algebra modules & quizzes...');

    const linearModules = [
        {
            title: 'Introduction to Vectors',
            order: 1,
            youtube: '',
            content: `
# Introduction to Vectors

In linear algebra, a **vector** is an object that has both magnitude (length) and direction. We often visualize them as arrows in space.

## Components
A vector $\mathbf{v}$ in 2D space ($\mathbb{R}^2$) is written as:
$$ \mathbf{v} = \begin{bmatrix} x \\ y \end{bmatrix} $$

## Operations
- **Addition**: We add vectors component-wise.
- **Scalar Multiplication**: Multiplying a vector by a number scales its length.
            `,
            quizzes: [
                { question: "A vector is defined by which two properties?", options: ["Mass and Velocity", "Magnitude and Direction", "Length and Width", "Origin and Destination"], correct: "Magnitude and Direction" },
                { question: "In R2, how many components does a vector have?", options: ["1", "2", "3", "Infinite"], correct: "2" },
                { question: "Vectors are typically represented as:", options: ["Circles", "Arrows", "Points", "Lines"], correct: "Arrows" }
            ]
        },
        {
            title: 'Gaussian Elimination',
            order: 2,
            youtube: '',
            content: `
# Gaussian Elimination

Gaussian Elimination is a systematic algorithm for solving systems of linear equations.

## Row Echelon Form (REF)
The goal is to transform the system's augmented matrix into REF, where:
1. All non-zero rows are above any rows of all zeros.
2. The leading coefficient (pivot) of a non-zero row is always strictly to the right of the leading coefficient of the row above it.

Once in this form, we can solve for variables using **back-substitution**.
            `,
            quizzes: [
                { question: "What is the goal of Gaussian Elimination?", options: ["Find determinants", "Invert a matrix", "Row Echelon Form", "Eigenvalues"], correct: "Row Echelon Form" },
                { question: "Gaussian Elimination is used to solve:", options: ["Quadratic Equations", "Systems of Linear Equations", "Differential Equations", "Integrals"], correct: "Systems of Linear Equations" },
                { question: "The leading non-zero entry in a row is called a:", options: ["Pivot", "Scalar", "Vector", "Basis"], correct: "Pivot" }
            ]
        },
        {
            title: 'Matrix Operations',
            order: 3,
            youtube: '',
            content: `
# Matrix Operations

## Addition & Subtraction
You can only add or subtract matrices if they have the **same dimensions**. You simply add corresponding entries.

## Matrix Multiplication
To multiply matrix $A$ (size $m \times n$) by matrix $B$ (size $n \times p$), the number of columns in $A$ must equal the number of rows in $B$. The result is a $m \times p$ matrix.
$$ (AB)_{ij} = \sum_{k} A_{ik} B_{kj} $$
            `,
            quizzes: [
                { question: "Can you multiply a 2x3 matrix by a 2x3 matrix?", options: ["Yes", "No"], correct: "No" },
                { question: "Matrix addition is done:", options: ["Row by Column", "Component-wise", "Diagonally", "Randomly"], correct: "Component-wise" },
                { question: "If A is 3x2 and B is 2x4, what size is AB?", options: ["3x2", "2x4", "3x4", "Undefined"], correct: "3x4" }
            ]
        },
        {
            title: 'Eigenvectors and Eigenvalues',
            order: 4,
            youtube: '',
            content: `
# Eigenvectors & Eigenvalues

Eigenvectors are special vectors that, when transformed by a linear transformation (matrix), do not change their span (line). They only get scaled.

## The Equation
$$ A\mathbf{v} = \lambda\mathbf{v} $$
- $A$ is the transformation matrix.
- $\mathbf{v}$ is the **eigenvector**.
- $\lambda$ (lambda) is the **eigenvalue**, the scaling factor.
            `,
            quizzes: [
                { question: "What does an eigenvector do during a linear transformation?", options: ["Rotates", "Scales only", "Disappears", "Becomes orthogonal"], correct: "Scales only" },
                { question: "The scalar lambda represents the:", options: ["Eigenvector", "Eigenvalue", "Matrix", "Determinant"], correct: "Eigenvalue" },
                { question: "Which equation defines eigenvectors?", options: ["Av = b", "Ax = 0", "Av = lambda v", "A + B = C"], correct: "Av = lambda v" }
            ]
        }
    ];

    for (const mod of linearModules) {
        const [insertedModule] = await db.insert(modules).values({
            courseId: 'linear-algebra',
            title: mod.title,
            orderIndex: mod.order,
            contentMarkdown: mod.content,
            youtubeUrl: mod.youtube,
        }).returning({ id: modules.id });

        if (mod.quizzes) {
            for (const q of mod.quizzes) {
                await db.insert(quizzes).values({
                    moduleId: insertedModule.id,
                    question: q.question,
                    options: q.options,
                    correctAnswer: q.correct,
                });
            }
        }
    }

    console.log('Seeding complete!');
    process.exit(0);
};

runSeed().catch((err) => {
    console.error('Seeding failed:', err);
    process.exit(1);
});
