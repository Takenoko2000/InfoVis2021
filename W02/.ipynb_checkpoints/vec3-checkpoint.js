class Vec3
{
// Constructor
constructor( x, y, z )
    {
    this.x = x;
    this.y = y;
    this.z = z;
    }
    
    add( v )
    {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
    return this;
    }
    
    min()
    {
        let result;
        
        if (x >= y){
            result = y;
        }
        else{
            result = x;
        }
            
        if (result >= z){
            result = z;
        }
        
        return result;
        
    }
    
    mid()
    {
        
        let result;
        
        if (x != this.min() && x != this.max() ){
            result = x;
        }
        
        if (y != this.min() && y !=  this.max() ){
            result = y;
        }
        
        if (z !=  this.min() && z !=  this.max() ){
            result = z;
        }
        
        return result;
        
    }
    
    max()
    {
        
        let result;
        
        if (x >= y){
            result = x;
        }
        else{
            result = y;
        }
            
        if (z >= result){
            result = z;
        }
        
        return result;
    }
    
}