import Papa from "papaparse";
import allergensCsv from "../data/allergens.csv";

let allergenMap = {};

Papa.parse(allergensCsv, {
  header: true,
  download: true,
  complete: (results) => {
    allergenMap = results.data.reduce((acc, row) => {
      acc[row.allergen] = row.ingredients
        .split(",")
        .map((i) => i.trim().toLowerCase());
      return acc;
    }, {});
  },
});

export function getAllergenMap() {
  return allergenMap;
}
