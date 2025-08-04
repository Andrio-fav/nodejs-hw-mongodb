const parseIsFavourite = (isFavourite) => {
  const posibleTrue = ['true', '1'];
  const posibleFalse = ['false', '0'];
  if (posibleTrue.includes(isFavourite)) {
    return true;
  }
  if (posibleFalse.includes(isFavourite)) {
    return false;
  }
  return null;
};

const parseContactType = (contactType) => {
  const posibleTypes = ['work', 'home', 'personal'];
  if (posibleTypes.includes(contactType)) {
    return contactType;
  }
  return null;
};

export const parseFilterParams = (query) => {
  const { isFavourite, type } = query;

  const parsedIsFavourite = parseIsFavourite(isFavourite);
  const parsedType = parseContactType(type);

  return {
    isFavourite: parsedIsFavourite,
    type: parsedType,
  };
};