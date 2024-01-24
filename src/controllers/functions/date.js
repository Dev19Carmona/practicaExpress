const getDateInfo = (birthdate) => {
  const datetime = new Date(birthdate);
    const year = datetime.getFullYear();
    const month = datetime.getMonth() + 1;
    const day = datetime.getDate() + 1;
    return {
      datetime,
      month,
      year,
      day
    }
}

module.exports = {
  getDateInfo
}