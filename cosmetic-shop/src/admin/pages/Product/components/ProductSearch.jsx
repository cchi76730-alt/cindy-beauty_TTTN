function ProductSearch({

    search,

    setSearch

}) {

    return (

        <div className="card border-0 shadow-sm mb-4">

            <div className="card-body">

                <input
                    type="text"
                    className="form-control"
                    placeholder="Tìm kiếm sản phẩm..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                />

            </div>

        </div>
    );
}

export default ProductSearch;