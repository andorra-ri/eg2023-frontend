import { indexate } from '/@/utils';
import type { ElectionsService, Party, List, Results, Historic } from '/@/types';
import type { PartyDTO, ListDTO, ResultsDTO, HistoricDTO } from './types';

const URL = 'https://andorra-ri.work/api';

const adaptParty = (party: PartyDTO): Party => {
  const {
    _id: id,
    coalition_leader: [coalitionLeaderId] = [],
    coalition_name: coalitionName,
    ...rest
  } = party;
  const logo = `/images/parties/${id}.png`;
  return { id, ...rest, logo, coalitionLeaderId, coalitionName };
};

const getLists = async (): Promise<List[]> => {
  const response = await fetch(`${URL}/elections/EG2023`);
  if (!response.ok) throw new Error('RETRIEVE_LISTS_ERROR');
  const { lists, parties }: { lists: ListDTO[], parties: PartyDTO[] } = await response.json();

  const partiesDict = indexate(parties.map(adaptParty), 'id');

  return lists.map(list => {
    const { _id, ...rest } = list;
    return {
      ...rest,
      id: _id,
      votes: 0,
      seats: 0,
      district: list.district[0].split('_')[1],
      parties: list.parties.map(partyId => partiesDict[partyId]),
      nominees: list.nominees.map(nominee => {
        const party = partiesDict[nominee.party[0]];
        const photo = `/images/nominees/${nominee._id}.jpg`; // eslint-disable-line no-underscore-dangle
        return { ...nominee, party, photo };
      }),
    };
  });
};

const getResults = async (): Promise<Results[]> => {
  const response = await fetch(`${URL}/results`);
  if (!response.ok) return [];
  const results: ResultsDTO[] = await response.json();

  return results.map(result => {
    const { _id: id, _created, last_modified: last, ...rest } = result;
    const lastModified = new Date(last);
    const [, district] = result.district.split('_');
    const lists = result.lists.map(({ _id: listId, votes }) => ({ listId, votes }));
    return { ...rest, id, district, lists, lastModified };
  });
};

const getHistorics = async (): Promise<Historic[]> => {
  const response = await fetch(`${URL}/historics`);
  if (!response.ok) throw new Error('RETRIEVE_HISTORIC_ERROR');
  const historics: HistoricDTO[] = await response.json();
  return historics;
};

const service: ElectionsService = { getLists, getResults, getHistorics };

export default service;
