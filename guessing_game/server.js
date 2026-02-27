const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3000;

const testData = [
    { title: "The Legend of Zelda: Breath of the Wild", rating: 10 },
    { title: "Super Mario Odyssey", rating: 9 },
    { title: "The Witcher 3: Wild Hunt", rating: 9 },
    { title: "Red Dead Redemption 2", rating: 10 },
    { title: "God of War", rating: 9 },
    { title: "Hollow Knight", rating: 9 },
    { title: "Celeste", rating: 9 },
    { title: "Hades", rating: 10 },
    { title: "Stardew Valley", rating: 8 },
    { title: "Minecraft", rating: 9 }
];

app.use(cors());
app.use(express.static("public"));
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "Welcome to the Game Ratings Guesser!" });
});

app.get("/games", (req, res) => {
    res.json(testData);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})

