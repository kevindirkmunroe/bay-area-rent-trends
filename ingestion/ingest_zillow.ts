import axios from "axios";
import csv = require('csv-parser');
import { Pool } from "pg";
import { Readable } from "stream";

// 🔧 CONFIG
const ZILLOW_CSV_URL = "https://files.zillowstatic.com/research/public_csvs/zori/Metro_zori_uc_sfrcondomfr_sm_month.csv";

const pool = new Pool({
    user: "kevinmunroe",
    host: "localhost",
    database: "bay_area_rent_trends",
    password: "",
    port: 5432,
});

// 🧠 Helper: detect date columns
const isDateColumn = (col: string) => /^\d{4}-\d{2}-\d{2}$/.test(col);

// 🧠 Normalize city names (basic for now)
const normalizeCity = (city: string) => city.split(',')[0].trim();

// 🚀 Main ingestion
async function ingestZillow() {
    console.log("Starting Zillow ingestion...");

    const response = await axios.get(ZILLOW_CSV_URL, {
        responseType: "stream",
    });

    const results: any[] = [];

    return new Promise<void>((resolve, reject) => {
        response.data
            .pipe(csv())
            .on("data", (row: any[string]) => {
                const city = normalizeCity(row["RegionName"]);
                const state = row["StateName"];

                Object.keys(row).forEach((col) => {
                    if (isDateColumn(col) && row[col]) {
                        results.push({
                            city,
                            state,
                            date: col,
                            rent_index: parseFloat(row[col]),
                        });
                    }
                });
            })
            .on("end", async () => {
                console.log(`Parsed ${results.length} records`);

                const client = await pool.connect();

                try {
                    await client.query("BEGIN");

                    for (const record of results) {
                        await client.query(
                            `
              INSERT INTO rent_data (city, state, date, rent_index)
              VALUES ($1, $2, $3, $4)
              ON CONFLICT (city, state, date)
              DO UPDATE SET rent_index = EXCLUDED.rent_index
              `,
                            [
                                record.city,
                                record.state,
                                record.date,
                                record.rent_index,
                            ]
                        );
                    }

                    await client.query("COMMIT");
                    console.log("Zillow ingestion complete ✅");
                } catch (err) {
                    await client.query("ROLLBACK");
                    console.error("Error during ingestion:", err);
                    reject(err);
                } finally {
                    client.release();
                    resolve();
                }
            })
            .on("error", (err: Error) => {
                console.error("CSV parsing error:", err);
                reject(err);
            });
    });
}

// ▶️ Run
ingestZillow()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
