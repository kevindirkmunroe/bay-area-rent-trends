import {Pool} from "pg";

export const pool = new Pool({
    user: "kevinmunroe",
    host: "localhost",
    database: "bay_area_rent_trends",
    password: "",
    port: 5432,
});
