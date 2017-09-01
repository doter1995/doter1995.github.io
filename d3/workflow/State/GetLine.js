export const GetLine=(x1,y1,x2,y2,r1,r2)=>{
    var line;
        var X=x2-x1,Y=y2-y1;
        var Z=Math.sqrt(Math.pow(X,2)+Math.pow(Y,2));
        var a1=X*r1/Z;
        var b1=Y*r1/Z;
        var a2=X*r2/Z;
        var b2=Y*r2/Z;
        return line={x1:x1+a1,y1:y1+b1,x2:x2-a2,y2:y2-b1}
}
export default GetLine