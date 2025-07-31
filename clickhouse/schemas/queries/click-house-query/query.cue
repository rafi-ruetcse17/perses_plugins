package model

import (
	"strings"
)

kind: "ClickHouseQuery"
spec: close({
	datasource?: {
		kind: "ClickHouseDatasource"
	}
	query:             strings.MinRunes(1)
})
