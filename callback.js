
const testCallback = (text, callback) => {
    setTimeout(() => {
        callback(null, `El texto es: ${text} - ${new Date().toISOString()}`);
    }, 2000);
};

const testPromise = async (text) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(`El texto es: ${text} - ${new Date().toISOString()}`);
        }, 2000);
    });
};

testCallback("Hola Callback", (err, result) => {
    if (err) {
        console.error("❌ Error:", err);
        return;
    }
    console.log("📋 Resultado con callback:", result);
});
