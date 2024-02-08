import express from 'express'
import { token_verification } from '../common_functions.js'
import {insert_Venue, get_Venue, get_Venue_Country, get_Venue_City, get_Venue_info} from '../../model/database.js'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import cors from 'cors';
import multer from 'multer'
import { BlobServiceClient, StorageSharedKeyCredential } from '@azure/storage-blob';



const router = express.Router()

//router.use(cookieParser());
router.use(token_verification);




let m = multer()

router
.route('')
.post( m.array('Image',12), async(req, res)=>{

  console.log("Body", req.body)
  console.log("File", req.files)
  const {Name, Capacity, Address, Category} = req.body
    
  try{
  

  const blobServiceClient = new BlobServiceClient(`https://lord.blob.core.windows.net/test?sp=r&st=2024-02-07T14:51:13Z&se=2024-02-07T22:51:13Z&sv=2022-11-02&sr=c&sig=LKYnFIFaKYr6okd9Mpg8A2V8jmUmvG8qvRw3Tr0X85Q%3D`);
  console.log('hello')
  const containerName =  req.user.id;
  
  const containerClient = blobServiceClient.getContainerClient(containerName);

  const content = req.file.buffer;
  const blobName = "img-user" + `${req.user.id}` + new Date().getTime() + `.png`;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  const contentType = 'image/png';  // Adjust this based on your file type

  // Upload the file to Azure Blob Storage with content type
  const uploadBlobResponse = await blockBlobClient.upload(content, content.length, {
    blobHTTPHeaders: { blobContentType: contentType }
  });

  console.log(`Upload block blob ${blobName} successfully`, uploadBlobResponse.requestId);
  const result = await insert_Venue(Name, Capacity, Address, Category, req.user.id)
  res.send({ status: "success"})
  }
    catch(e){
      console.log(e)
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