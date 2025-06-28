import { hiragana2katakana } from '../../utilities/convertKana';

const hasStr = (target, search) => {
  if (typeof target !== 'string' || !target) {
    return false;
  }
  if (search === '') {
    return true;
  }
  return target.indexOf(search) > -1;
};

const validateGroup = (
  group,
  searchTxt = '',
  searchTxtKana = '',
  bldgIds = []
) => {
  let searchMatch = false;
  if (searchTxt === '') {
    searchMatch = true;
  } else {
    searchMatch =
      hasStr(group.name, searchTxt) ||
      hasStr(group.name_kana, searchTxtKana) ||
      hasStr(group.charge_person_name, searchTxt);
  }

  let bldgMatch = false;
  if (bldgIds.length === 0) {
    bldgMatch = true;
  } else {
    bldgMatch = bldgIds.indexOf(group.BuildingId) > -1;
  }

  return searchMatch && bldgMatch;
};

const filterGroups = (groups, searchTxt = '', bldgIds = []) => {
  if (typeof searchTxt !== 'string') {
    searchTxt = '';
  }
  const searchTxtKana = hiragana2katakana(searchTxt);

  return groups.filter(group => {
    return validateGroup(group, searchTxt, searchTxtKana, bldgIds);
  });
};

export { filterGroups };
