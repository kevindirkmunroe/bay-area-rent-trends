import express from "express";
import cors from "cors";
import { getRentData } from "./api/rentData";
import {getAffordabilityScore} from "./api/affordabilityScore";

const app = express();
const PORT = 3000;

app.use(cors());
app.get("/rent-data", getRentData);
app.get("/affordability-score", getAffordabilityScore);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
