import { Request, Response } from "express";
import {pool} from "../db";

export const getAffordabilityScore = async(req: Request, resp: Response) => {
    try{
        const { city, state, income} = req.query;
        if(!income){
            return resp.status(400).json(
            {
                error: "income is required"
            });
        }

        const isAllCities = !city && !state;

        let query = `
            WITH latest_rent AS (
              SELECT
                city,
                state,
                rent_index AS monthly_rent,
                date,
                ROW_NUMBER() OVER (PARTITION BY city, state ORDER BY date DESC) as rn
              FROM bay_area_rent_data
            )
            SELECT
              city,
              state,
              monthly_rent,
              monthly_rent * 12 AS annual_rent,
              $1::NUMERIC AS income,
              (monthly_rent * 12) / $1::NUMERIC AS rent_to_income_ratio,
              CASE
                WHEN (monthly_rent * 12) / $1::NUMERIC <= 0.30 THEN true
                ELSE false
              END AS affordable,
              0.30 AS threshold
            FROM latest_rent
            WHERE rn = 1
        `;

        if(!isAllCities){
            query += " AND city = $2  AND state = $3"
        }

        console.log(`isAllCities= ${isAllCities} query= ${query}`);

         const result = isAllCities? await pool.query(query, [Number(income)]) : await pool.query(query, [Number(income), city, state]);
         if(result.rows.length == 0){
             return resp.status(404).json({
                 error: `No data found for given city: ${city} state ${state}`
             })
         }

         console.log(`result set length: ${result.rows.length}`);
         if(isAllCities){
             return resp.json(result.rows);
         }
         return resp.json(result.rows[0]);
    }catch(e){
        console.error('Affordability error', e);
        return resp.status(500).json({
            error: 'Internal server error'
        })
    }
}
