function StoreCard({ store, position }) {
    return (
        <div
            style={{
                position: 'absolute',
                left: `${position.x}px`,
                top: `${position.y}px`,
                backgroundColor: 'white',
                padding: '10px',
                borderRadius: '5px',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
                pointerEvents: 'none',
                transform: 'translate(-50%, -100%)', // Center the card above the icon
            }}
            className="h-full w-full"
        >
            HALLO
            <h3>{store.storeType}</h3>
            <p>ID: {store.id} TEST</p>
            <p>Latitude: {store.latitude}</p>
            <p>Longitude: {store.longitude}</p>
            <p>Address: {store.address}</p>
            <p>Status: {store.status}</p>
            <p className="flex items-center">
                Automaat status:
                <span className="ml-2 relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500">a</span>
                </span>
            </p>
        </div>
    );
}

export default StoreCard;