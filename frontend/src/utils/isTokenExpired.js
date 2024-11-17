export const isTokenExpired = (tokenExp) => {
    const expirationDate = new Date(tokenExp * 1000);
    const today = new Date();
    const isTokenExpired = expirationDate <= today; 
    
    return isTokenExpired;
}