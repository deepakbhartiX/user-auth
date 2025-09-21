const errorhandler = (err,req,res,next) =>{
       
        res.status(err.statusCode || 500).json({
            success:false,          
            message: err.message || "Error from error handller middleware",
           
           
        })
   }


module.exports = {errorhandler}