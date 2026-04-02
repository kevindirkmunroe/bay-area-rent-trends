import { Request, Response } from "express";
import { pool } from "../db";

export const getRentData = async( req: Request, resp: Response) => {
    try{
        const { city, state, start_date, end_date } = req.query;

        if(!city || !state){
            return resp.status(400).json({
                error: "city and state are required"
            });
        }

        const query = `
            SELECT
                city,
                state,
                date,
                rent_index
            FROM bay_area_rent_data 
            WHERE city= $1 AND state = $2 and ($3::date IS  NULL or date >= $3)
            and ($4::date IS NULL or date <= $4)
            ORDER BY date
        `
        const result = await pool.query(query, [
            city,
            state,
            start_date || null,
            end_date || null,
        ]);


        if (result.rows.length === 0) {
            return resp.status(404).json({
                error: "No rent data found for given parameters",
            });
        }

        return resp.json({
            city,
            state,
            count: result.rows.length,
            data: result.rows,
        });

    } catch (err) {
        console.error("Rent data error:", err);
        return resp.status(500).json({
            error: "Internal server error",
        });
    }
}
