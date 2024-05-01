const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

function ask(question) {
    return new Promise(resolve => readline.question(question, resolve));
}

async function createUser() {
    try {
        const email = await ask('Enter email for username: ');
        const password = await ask('Enter password: ');
        const confirm = await ask('Confirm password: ');
        const role = await ask('Enter role (admin/client): ');

        if (password !== confirm) {
            console.log('Passwords do not match!');
            process.exit(1);
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role
            }
        });

        console.log(`User created with ID: ${user.id}, Role: ${user.role}`);
    } catch (error) {
        console.error('Failed to create user:', error);
    } finally {
        readline.close();
        await prisma.$disconnect();
    }
}

createUser();
