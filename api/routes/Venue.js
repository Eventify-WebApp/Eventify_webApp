import express from 'express'
import { token_verification } from '../common_functions.js'
import {insert_Venue, get_Venue, get_Venue_Country, get_Venue_City, get_Venue_info} from '../../model/database.js'
import cookieParser from 'cookie-parser'
import cors from 'cors';


const router = express.Router()

//router.use(cookieParser());
router.use(token_verification);



router
.route('')
.post( async(req, res)=>{
    const {Name, Capacity, Address, Category} = req.body
    try{
    const result = await insert_Venue(Name, Capacity, Address, Category, req.user.id)
    res.send({ status: "success"})
    }
    catch(e){
    res.send({ status: "failure"})
    }
    
    
})
.put(async(req, res)=>{
    const {Name, Capacity, Address, Category} = req.body
    const result = await insert_Venue(Name, Capacity, Address, Category, req.user.id)
    res.send(result)
})



router.route('/list').post(async (req, res) => {
  try {
    const { pageNumber, pageSize, City} = req.body; // Assuming pageNumber is passed as a query parameter
    
    if (isNaN(pageNumber)) {
      res.status(400).json({ error: 'Invalid pageNumber parameter' });
      return;
    }
    console.log("CCCCCC ", City)
    // Assuming get_Venue supports pagination and returns data based on pageNumber
    const result = await get_Venue(pageNumber, pageSize, City);
    res.send(result);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.route('/list/country').get(async (req, res) => {
  try {
    
    const result = await get_Venue_Country();
    res.send(result);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.route('/list/city').post(async (req, res) => {
  try {
    
    const result = await get_Venue_City();
    console.log(result[0]);
    res.send(result);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.route('/:bookName').get(async (req, res)=>{
  const { bookName } = req.params;
  console.log(req.params)
  try{
      const venueData = await get_Venue_info(bookName)
      console.log(venueData)
      res.send({venueData: venueData});
  }
  catch(error){
    res.status(500).json({ error: 'Internal Server Error' });
  }

})


export default router;