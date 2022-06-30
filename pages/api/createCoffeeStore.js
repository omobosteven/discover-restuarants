import { table, getMinifiedRecords } from "../../lib/airtable";

export default async (req, res) => {
  if (req.method === "POST") {
    const { id, name, address, neighbourhood, imgUrl, voting } = req.body;

    try {
      if (id) {
        const findCoffeeStoreRecords = await table
          .select({
            filterByFormula: `id="${id}"`,
          })
          .firstPage();

        if (findCoffeeStoreRecords.length !== 0) {
          const records = getMinifiedRecords(findCoffeeStoreRecords);
          res.join(records);
        } else {
          if (name) {
            const createRecords = await table.create([
              {
                fields: { id, name, address, neighbourhood, imgUrl, voting },
              },
            ]);

            const records = getMinifiedRecords(createRecords);
            res.json(records);
          } else {
            res.status(400).json({ message: "Id or name is missing" });
          }
        }
      } else {
        res.status(400).json({ message: "Id is missing" });
      }
    } catch (err) {
      console.error("Error creating or finding store", err);
      res.status(500);
      res.json({ message: "Error creating or finding store", err });
    }
  }
};
