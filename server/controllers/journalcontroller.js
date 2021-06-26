const Express = require("express"); // import Express framework and store it inside variable Express
const router = Express.Router(); // create new variable router - using Express variable to access the Router() method
// Router() method will return a router object for us
let validateJWT = require("../middleware/validate-jwt");
// Import the Journal Model
const { JournalModel } = require("../models");
router.get('/practice', validateJWT, (req, res) => {  
// use the router object by using the router variable to get access into the Router() object methods /practice is the path
    res.send('Hey!! This is a practice route!') // send() is an express method called on the res(or response) object.
});
/*
=======================================
    Journal Create
=======================================
 */
router.post("/create", validateJWT, async (req, res) => {
    const { title, date, entry } = req.body.journal;
    const { id } = req.user;
    const journalEntry = {
        title,
        date,
        entry,
        owner: id
    }
    try {
        const newJournal = await JournalModel.create(journalEntry);
        res.status(200).json(newJournal);
    } catch (err) {
        res.status(500).json({ error: err });
    }


});

/* 
=======================================
    Get All Journals
=======================================
*/
router.get("/", async (req, res) => {
    try {
        const entries = await JournalModel.findAll();
        res.status(200).json(entries);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

/* 
=======================================
    Get Journals by User
=======================================
*/
router.get("/mine", validateJWT, async (req, res) => {
    const { id } = req.user;
    try {
        const userJournals = await JournalModel.findAll({
            where: {
                owner: id
            }
        });
        res.status(200).json(userJournals);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

/* 
=======================================
    Get Journals by Title
=======================================
*/
router.get("/:title", async (req, res) => {
    const { title } = req.params;
    try {
        const results = await JournalModel.findAll({
            where: { title: title }
        });
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

/* 
=======================================
    Update a Journal
=======================================
*/
router.put("/update/:entryId", validateJWT, async (req, res) => {
    const { title, date, entry } = req.body.journal;
    const journalId = req.params.entryId;
    const userId = req.user.id;

    const query = {
        where: {
            id: journalId,
            owner: userId
        }
    };

    const updatedJournal = {
        title: title,
        date: date,
        entry: entry
    };

    try {
        const update = await JournalModel.update(updatedJournal, query);
        res.status(200).json(update);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

/*
=======================================
    Delete a Journal
=======================================
*/
router.delete("/delete/:id", validateJWT, async (req, res) => {
    const ownerId = req.user.id;
    const journalId = req.params.id;

    try {
        const query = {
            where: {
                id: journalId,
                owner: ownerId
            }
        };

        await JournalModel.destroy(query);
        res.status(200).json({ message: "Journal Entry Removed" });
    } catch (err) {
        res.status(500).json({ error: err });
    }
});
router.get('/about', (req, res) => {
    res.send("This is the about route!");
});

module.exports = router; // export the module for usage outside of the file