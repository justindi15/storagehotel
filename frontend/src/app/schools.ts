export interface LatLng {
    lat: number
    lng: number
  }

export interface FreeDate {
  value: Date,
  label: string,
}
  
export interface School {
    name: string;
    upperRight: LatLng
    lowerLeft: LatLng
    SupplyDropDates: FreeDate[]
    FreePickupDates: FreeDate[]
}

export const SCHOOLS: School[] = [
    {
        name: 'UBC',
        upperRight: { lat: 49.278, lng: -123.14023 },
        lowerLeft: { lat: 49.209, lng: -123.26645 },
        SupplyDropDates: [
            {value: new Date(2020, 3, 2), label: 'Thursday, April 2'},
            {value: new Date(2020, 3, 9), label: 'Thursday, April 9'},
            {value: new Date(2020, 3, 18), label: 'Saturday, April 18'},
            {value: new Date(2020, 3, 22), label: 'Wednesday, April 22'},
            {value: new Date(2020, 3, 25), label: 'Saturday, April 25'},
        ],
        FreePickupDates: [
            {value: new Date(2020, 3, 18), label: 'Saturday, April 18'},
            {value: new Date(2020, 3, 22), label: 'Wednesday, April 22'},
            {value: new Date(2020, 3, 25), label: 'Saturday, April 25'},
            {value: new Date(2020, 3, 30), label: 'Thursday, April 30'},
        ]
    },
    {
        name: 'LANGARA',
        upperRight: { lat: 49.26974, lng: -123.04844},
        lowerLeft: { lat: 49.20434, lng: -123.1412},
        SupplyDropDates: [
            {value: new Date(2020, 3, 14), label: 'Tuesday, April 14'},
        ],
        FreePickupDates: [
            {value: new Date(2020, 3, 20), label: 'Monday, April 20'},
        ]
    },
    {
        name: 'BCIT',
        upperRight: { lat: 49.2752, lng: -122.96463},
        lowerLeft: { lat: 49.20451, lng: -123.04902},
        SupplyDropDates: [
            {value: new Date(2020, 4, 11), label: 'Monday, May 11'},
            {value: new Date(2020, 4, 17), label: 'Sunday, May 17'},
        ],
        FreePickupDates: [
            {value: new Date(2020, 4, 17), label: 'Sunday, May 17'},
            {value: new Date(2020, 4, 22), label: 'Friday, May 22'},
        ]
    },
    {
        name: 'CAPILANO',
        upperRight: { lat: 49.35783, lng: -122.96489},
        lowerLeft: { lat: 49.29521, lng: -123.04839},
        SupplyDropDates: [
            {value: new Date(2020, 3, 14), label: 'Tuesday, April 14'}
        ],
        FreePickupDates: [
            {value: new Date(2020, 3, 24), label: 'Friday, April 24'}
        ]
    },
    {
        name: 'CAPILANO',
        upperRight: { lat: 49.29306, lng: -123.00326},
        lowerLeft: { lat: 49.27551, lng: -123.04839},
        SupplyDropDates: [
            {value: new Date(2020, 3, 14), label: 'Tuesday, April 14'}
        ],
        FreePickupDates: [
            {value: new Date(2020, 3, 24), label: 'Friday, April 24'}
        ]
    },
    {
        name: 'SFU',
        upperRight: { lat: 49.2925, lng: -122.86655},
        lowerLeft: { lat: 49.24299, lng: -122.96389},
        SupplyDropDates: [
            {value: new Date(2020, 3, 10), label: 'Friday, April 10'},
            {value: new Date(2020, 3, 19), label: 'Sunday, April 19'}
        ],
        FreePickupDates: [
            {value: new Date(2020, 3, 19), label: 'Sunday, April 19'},
            {value: new Date(2020, 3, 26), label: 'Sunday, April 26'}
        ]
    },
    {
        name: 'SFU',
        upperRight: { lat: 49.29278, lng: -122.96428},
        lowerLeft: { lat: 49.27553, lng: -123.00301},
        SupplyDropDates: [
            {value: new Date(2020, 3, 10), label: 'Friday, April 10'},
            {value: new Date(2020, 3, 19), label: 'Sunday, April 19'}
        ],
        FreePickupDates: [
            {value: new Date(2020, 3, 19), label: 'Sunday, April 19'},
            {value: new Date(2020, 3, 26), label: 'Sunday, April 26'}
        ]
    },
    {
        name: 'SFU',
        upperRight: { lat: 49.24308, lng: -122.86524},
        lowerLeft: { lat: 49.23659, lng: -122.89452},
        SupplyDropDates: [
            {value: new Date(2020, 3, 10), label: 'Friday, April 10'},
            {value: new Date(2020, 3, 19), label: 'Sunday, April 19'}
        ],
        FreePickupDates: [
            {value: new Date(2020, 3, 19), label: 'Sunday, April 19'},
            {value: new Date(2020, 3, 26), label: 'Sunday, April 26'}
        ]
    },
    {
        name: 'DOUGLAS',
        upperRight: { lat: 49.32434, lng: -122.72243},
        lowerLeft: { lat: 49.27117, lng: -122.86577},
        SupplyDropDates: [
            {value: new Date(2020, 3, 11), label: 'Saturday, April 11'}
        ],
        FreePickupDates: [
            {value: new Date(2020, 3, 19), label: 'Sunday, April 19'}
        ]
    }
]
