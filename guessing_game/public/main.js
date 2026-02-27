// import puppeteer from "puppeteer";

async function getData() {
    try {
        const response = await fetch("http://localhost:3000/games");
        const data = await response.json();
        console.log("Fetched data:", data);
        return data;
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

document.getElementById("fetchButton").addEventListener("click", async () => {
    const data = await getData();
});