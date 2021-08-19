module.exports = {
    ensureAuthenticated:function(req,res,next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash('error_msg','Please Login first to view the content!!!')
        res.redirect('/users/login');
    }
}