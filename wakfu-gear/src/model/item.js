export const itemOfficialAPI = {
  title: {
    fr: null,
    en: null,
    es: null,
    pt: null
  },
  description: {
    fr: null,
    en: null,
    es: null,
    pt: null
  },
  definition: {
    item: {
      id: null,
      level: null,
      baseParameters: {
        itemTypeId: null,
        itemSetId: null,
        rarity: null,
        bindType: null,
        minimumShardSlotNumber: null,
        maximumShardSlotNumber: null
      },
      useParameters: {
        useCostAp: null,
        useCostMp: null,
        useCostWp: null,
        useRangeMin: null,
        useRangeMax: null,
        useTestFreeCell: null,
        useTestLos: null,
        useTestOnlyLine: null,
        useTestNoBorderCell: null,
        useWorldTarget: null
      },
      graphicParameters: {
        gfxId: null,
        femaleGfxId: null
      },
      properties: []
    },
    useEffects: [],
    useCriticalEffects: [],
    equipEffects: [
      {
        effect: {
          definition: {
            id: null,
            actionId: null,
            areaShape: null,
            areaSize: [],
            params: []
          }
        }
      }
    ]
  }
}

export const itemAPI = {
  id: null,
  iid: [],
  title: {
    en: null,
    es: null,
    fr: null,
    pt: null
  },
  lvl: null,
  type: null,
  set: null,
  rarity: null,
  shard: [],
  equipEffects: [
    {
      id: null,
      params: []
    }
  ]
}
