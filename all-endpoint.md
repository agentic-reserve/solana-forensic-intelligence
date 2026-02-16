> ## Documentation Index
> Fetch the complete documentation index at: https://www.helius.dev/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Get Wallet Identity

> Retrieve identity information for a known wallet address (i.e., exchanges, protocols, etc.)

## Request Parameters

<ParamField body="wallet" type="string" required>
  Solana wallet address (base58 encoded)
</ParamField>


## OpenAPI

````yaml openapi/wallet-api/openapi.yaml get /v1/wallet/{wallet}/identity
openapi: 3.0.3
info:
  title: Wallet API
  description: >
    A high-performance REST API for querying Solana wallet data including
    balances, transaction history, transfers, and identity information.


    ## Authentication


    All requests require an API key passed either as:

    - Query parameter: `?api-key=YOUR_API_KEY`

    - Header: `X-Api-Key: YOUR_API_KEY`
  version: 1.0.0
  contact:
    name: API Support
    url: https://helius.dev
servers:
  - url: https://api.helius.xyz
    description: Production server
security:
  - ApiKeyQuery: []
  - ApiKeyHeader: []
tags:
  - name: Identity
    description: Lookup wallet identities and known addresses
  - name: Balances
    description: Query token and NFT balances
  - name: History
    description: Transaction history and balance changes
  - name: Transfers
    description: Token transfer activity
  - name: Funding
    description: Wallet funding information
paths:
  /v1/wallet/{wallet}/identity:
    get:
      tags:
        - Identity
      summary: Get wallet identity
      description: >-
        Retrieve identity information for a known wallet address (i.e.,
        exchanges, protocols, etc.)
      operationId: getWalletIdentity
      parameters:
        - $ref: '#/components/parameters/WalletAddress'
      responses:
        '200':
          description: Identity information found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Identity'
        '400':
          $ref: '#/components/responses/BadRequest'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '404':
          description: No identity information available for this address
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
components:
  parameters:
    WalletAddress:
      name: wallet
      in: path
      required: true
      description: Solana wallet address (base58 encoded)
      schema:
        type: string
        pattern: ^[1-9A-HJ-NP-Za-km-z]{32,44}$
      example: GQUtvPx89ZNCwmvQqFmH59bJcU8fW8siETpaxod7Aydz
  schemas:
    Identity:
      type: object
      properties:
        address:
          type: string
          description: Solana wallet address
          example: HXsKP7wrBWaQ8T2Vtjry3Nj3oUgwYcqq9vrHDM12G664
        type:
          type: string
          description: Type of entity
          example: exchange
        name:
          type: string
          description: Display name
          example: Binance 1
        category:
          type: string
          description: Category classification
          example: Centralized Exchange
        tags:
          type: array
          items:
            type: string
          description: Additional classification tags
          example:
            - Centralized Exchange
      required:
        - address
        - type
        - name
        - category
        - tags
    Error:
      type: object
      properties:
        error:
          type: string
          description: Error message
          example: Invalid wallet address
        code:
          type: integer
          description: HTTP status code
          example: 400
        details:
          type: string
          description: Additional error details
          example: '''invalid-address'' is not a valid Solana address'
      required:
        - error
        - code
  responses:
    BadRequest:
      description: Invalid request parameters
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
          example:
            error: Invalid wallet address
            code: 400
            details: '''invalid-address'' is not a valid Solana address'
    Unauthorized:
      description: Missing or invalid API key
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
          example:
            error: API key required. Pass via ?api-key=xxx or X-Api-Key header
            code: 401
  securitySchemes:
    ApiKeyQuery:
      type: apiKey
      in: query
      name: api-key
      description: API key passed as query parameter
    ApiKeyHeader:
      type: apiKey
      in: header
      name: X-Api-Key
      description: API key passed in request header

````
> ## Documentation Index
> Fetch the complete documentation index at: https://www.helius.dev/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Get Wallet Balances

> Retrieve token and NFT balances for a wallet. **Pagination is manual** - the API returns up to 100 tokens per request.

Results are sorted by USD value in descending order. Tokens with pricing data appear first, followed by tokens without prices.

**Pagination:** Use the `page` parameter to fetch additional pages. The response includes `pagination.hasMore`
to indicate if more results are available. Each request makes a single API call and costs 100 credits.


## Request Parameters

<ParamField body="wallet" type="string" required>
  Solana wallet address (base58 encoded)
</ParamField>

<ParamField body="page" type="number" default="1">
  Page number for pagination (1-indexed)
</ParamField>

<ParamField body="limit" type="number" default="100">
  Maximum number of tokens per page
</ParamField>

<ParamField body="showZeroBalance" type="boolean" default="false">
  Include tokens with zero balance
</ParamField>

<ParamField body="showNative" type="boolean" default="true">
  Include native SOL in results
</ParamField>

<ParamField body="showNfts" type="boolean" default="false">
  Include NFTs in results (max 100, first page only)
</ParamField>


## OpenAPI

````yaml openapi/wallet-api/openapi.yaml get /v1/wallet/{wallet}/balances
openapi: 3.0.3
info:
  title: Wallet API
  description: >
    A high-performance REST API for querying Solana wallet data including
    balances, transaction history, transfers, and identity information.


    ## Authentication


    All requests require an API key passed either as:

    - Query parameter: `?api-key=YOUR_API_KEY`

    - Header: `X-Api-Key: YOUR_API_KEY`
  version: 1.0.0
  contact:
    name: API Support
    url: https://helius.dev
servers:
  - url: https://api.helius.xyz
    description: Production server
security:
  - ApiKeyQuery: []
  - ApiKeyHeader: []
tags:
  - name: Identity
    description: Lookup wallet identities and known addresses
  - name: Balances
    description: Query token and NFT balances
  - name: History
    description: Transaction history and balance changes
  - name: Transfers
    description: Token transfer activity
  - name: Funding
    description: Wallet funding information
paths:
  /v1/wallet/{wallet}/balances:
    get:
      tags:
        - Balances
      summary: Get wallet balances
      description: >
        Retrieve token and NFT balances for a wallet. **Pagination is manual** -
        the API returns up to 100 tokens per request.


        Results are sorted by USD value in descending order. Tokens with pricing
        data appear first, followed by tokens without prices.


        **Pagination:** Use the `page` parameter to fetch additional pages. The
        response includes `pagination.hasMore`

        to indicate if more results are available. Each request makes a single
        API call and costs 100 credits.
      operationId: getWalletBalances
      parameters:
        - $ref: '#/components/parameters/WalletAddress'
        - name: page
          in: query
          description: Page number for pagination (1-indexed)
          schema:
            type: integer
            minimum: 1
            default: 1
          example: 1
        - name: limit
          in: query
          description: Maximum number of tokens per page
          schema:
            type: integer
            minimum: 1
            maximum: 100
            default: 100
          example: 100
        - name: showZeroBalance
          in: query
          description: Include tokens with zero balance
          schema:
            type: boolean
            default: false
        - name: showNative
          in: query
          description: Include native SOL in results
          schema:
            type: boolean
            default: true
        - name: showNfts
          in: query
          description: Include NFTs in results (max 100, first page only)
          schema:
            type: boolean
            default: false
      responses:
        '200':
          description: Wallet balances retrieved successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/BalancesResponse'
        '400':
          $ref: '#/components/responses/BadRequest'
        '401':
          $ref: '#/components/responses/Unauthorized'
components:
  parameters:
    WalletAddress:
      name: wallet
      in: path
      required: true
      description: Solana wallet address (base58 encoded)
      schema:
        type: string
        pattern: ^[1-9A-HJ-NP-Za-km-z]{32,44}$
      example: GQUtvPx89ZNCwmvQqFmH59bJcU8fW8siETpaxod7Aydz
  schemas:
    BalancesResponse:
      type: object
      properties:
        balances:
          type: array
          items:
            $ref: '#/components/schemas/TokenBalance'
          description: >
            Array of token balances for the current page, including native SOL.

            When showNative=true, SOL appears as the first element with mint
            address So11111111111111111111111111111111111111112.

            Other tokens are sorted by USD value (descending).
        nfts:
          type: array
          items:
            $ref: '#/components/schemas/Nft'
          description: >-
            Array of NFT holdings (only included if showNfts=true, max 100,
            first page only)
        totalUsdValue:
          type: number
          description: Total USD value of balances on this page (not total portfolio value)
          example: 217.98
        pagination:
          type: object
          description: >-
            Pagination metadata. Users must manually request additional pages
            using the page parameter.
          properties:
            page:
              type: integer
              description: Current page number
              example: 1
            limit:
              type: integer
              description: Number of items per page
              example: 100
            hasMore:
              type: boolean
              description: >-
                True if more results are available. Increment the page parameter
                to fetch the next page.
              example: true
          required:
            - page
            - limit
            - hasMore
      required:
        - balances
        - totalUsdValue
        - pagination
    TokenBalance:
      type: object
      properties:
        mint:
          type: string
          description: Token mint address
          example: So11111111111111111111111111111111111111112
        symbol:
          type: string
          nullable: true
          description: Token symbol
          example: SOL
        name:
          type: string
          nullable: true
          description: Token name
          example: Solana
        balance:
          type: number
          description: Token balance (adjusted for decimals)
          example: 1.5
        decimals:
          type: integer
          description: Number of decimal places
          example: 9
        pricePerToken:
          type: number
          nullable: true
          description: Price per token in USD
          example: 145.32
        usdValue:
          type: number
          nullable: true
          description: Total USD value of holdings
          example: 217.98
        logoUri:
          type: string
          nullable: true
          description: URL to token logo image
          example: https://example.com/sol-logo.png
        tokenProgram:
          type: string
          enum:
            - spl-token
            - token-2022
          description: >-
            Token program type (spl-token for legacy, token-2022 for new
            standard)
          example: spl-token
      required:
        - mint
        - balance
        - decimals
        - tokenProgram
    Nft:
      type: object
      properties:
        mint:
          type: string
          description: NFT mint address
          example: 7Xq8wXyXVqfBPPqVJjPDwG9zN5wCVxBYZ6z7vPYBzr6F
        name:
          type: string
          nullable: true
          description: NFT name
          example: Degen Ape
        imageUri:
          type: string
          nullable: true
          description: NFT image URI
          example: https://example.com/nft.png
        collectionName:
          type: string
          nullable: true
          description: Collection name
          example: Degen Ape Academy
        collectionAddress:
          type: string
          nullable: true
          description: Collection address
          example: DegN1dXmU2uYa4n7U9qTh7YNYpK4u8L9qXx7XqYqJfGH
        compressed:
          type: boolean
          description: Whether this is a compressed NFT
          example: false
      required:
        - mint
        - compressed
    Error:
      type: object
      properties:
        error:
          type: string
          description: Error message
          example: Invalid wallet address
        code:
          type: integer
          description: HTTP status code
          example: 400
        details:
          type: string
          description: Additional error details
          example: '''invalid-address'' is not a valid Solana address'
      required:
        - error
        - code
  responses:
    BadRequest:
      description: Invalid request parameters
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
          example:
            error: Invalid wallet address
            code: 400
            details: '''invalid-address'' is not a valid Solana address'
    Unauthorized:
      description: Missing or invalid API key
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
          example:
            error: API key required. Pass via ?api-key=xxx or X-Api-Key header
            code: 401
  securitySchemes:
    ApiKeyQuery:
      type: apiKey
      in: query
      name: api-key
      description: API key passed as query parameter
    ApiKeyHeader:
      type: apiKey
      in: header
      name: X-Api-Key
      description: API key passed in request header

````
> ## Documentation Index
> Fetch the complete documentation index at: https://www.helius.dev/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Get Wallet History

> Retrieve transaction history for a wallet using the Enhanced Transactions API.
Returns human-readable, parsed transactions with balance changes for each transaction.
**Pagination is manual** - the API returns up to 100 transactions per request.

Returns transactions in reverse chronological order (newest first).

**Associated Token Accounts (ATAs):** The `tokenAccounts` parameter controls whether transactions
involving token accounts owned by the wallet are included:
- `balanceChanged` (recommended): Includes transactions that changed token account balances, filtering spam
- `none`: Only direct wallet interactions
- `all`: All token account transactions including spam

**Pagination:** Use the `before` parameter with `pagination.nextCursor` to fetch the next page.
The response includes `pagination.hasMore` to indicate if more results are available.
Each request makes a single API call and costs 100 credits.


## Request Parameters

<ParamField body="wallet" type="string" required>
  Solana wallet address (base58 encoded)
</ParamField>

<ParamField body="limit" type="number" default="100">
  Maximum number of transactions per request
</ParamField>

<ParamField body="before" type="string">
  Fetch transactions before this signature (use `pagination.nextCursor` from previous response)
</ParamField>

<ParamField body="after" type="string">
  Fetch transactions after this signature (for ascending order pagination)
</ParamField>

<ParamField body="type" type="string">
  Filter by transaction type. Available types: SWAP, TRANSFER, NFT\_SALE, NFT\_BID, NFT\_LISTING,
  NFT\_MINT, NFT\_CANCEL\_LISTING, TOKEN\_MINT, BURN, COMPRESSED\_NFT\_MINT, COMPRESSED\_NFT\_TRANSFER,
  COMPRESSED\_NFT\_BURN, CREATE\_STORE, WHITELIST\_CREATOR, ADD\_TO\_WHITELIST, REMOVE\_FROM\_WHITELIST,
  AUCTION\_MANAGER\_CLAIM\_BID, EMPTY\_PAYMENT\_ACCOUNT, UPDATE\_PRIMARY\_SALE\_METADATA, ADD\_TOKEN\_TO\_VAULT,
  ACTIVATE\_VAULT, INIT\_VAULT, INIT\_BANK, INIT\_STAKE, MERGE\_STAKE, SPLIT\_STAKE, CREATE\_AUCTION\_MANAGER,
  START\_AUCTION, CREATE\_AUCTION\_MANAGER\_V2, UPDATE\_EXTERNAL\_PRICE\_ACCOUNT, EXECUTE\_TRANSACTION

  * `SWAP`
  * `TRANSFER`
  * `NFT_SALE`
  * `NFT_BID`
  * `NFT_LISTING`
  * `NFT_MINT`
  * `NFT_CANCEL_LISTING`
  * `TOKEN_MINT`
  * `BURN`
  * `COMPRESSED_NFT_MINT`
  * `COMPRESSED_NFT_TRANSFER`
  * `COMPRESSED_NFT_BURN`
  * `CREATE_STORE`
  * `WHITELIST_CREATOR`
  * `ADD_TO_WHITELIST`
  * `REMOVE_FROM_WHITELIST`
  * `AUCTION_MANAGER_CLAIM_BID`
  * `EMPTY_PAYMENT_ACCOUNT`
  * `UPDATE_PRIMARY_SALE_METADATA`
  * `ADD_TOKEN_TO_VAULT`
  * `ACTIVATE_VAULT`
  * `INIT_VAULT`
  * `INIT_BANK`
  * `INIT_STAKE`
  * `MERGE_STAKE`
  * `SPLIT_STAKE`
  * `CREATE_AUCTION_MANAGER`
  * `START_AUCTION`
  * `CREATE_AUCTION_MANAGER_V2`
  * `UPDATE_EXTERNAL_PRICE_ACCOUNT`
  * `EXECUTE_TRANSACTION`
</ParamField>

<ParamField body="tokenAccounts" type="string" default="balanceChanged">
  Filter transactions involving token accounts owned by the wallet.

  * `balanceChanged` (recommended): Includes transactions that changed token balances, filters spam
  * `none`: Only transactions directly referencing the wallet
  * `all`: All transactions including token accounts (may include spam)
    * `none`
    * `balanceChanged`
    * `all`
</ParamField>


## OpenAPI

````yaml openapi/wallet-api/openapi.yaml get /v1/wallet/{wallet}/history
openapi: 3.0.3
info:
  title: Wallet API
  description: >
    A high-performance REST API for querying Solana wallet data including
    balances, transaction history, transfers, and identity information.


    ## Authentication


    All requests require an API key passed either as:

    - Query parameter: `?api-key=YOUR_API_KEY`

    - Header: `X-Api-Key: YOUR_API_KEY`
  version: 1.0.0
  contact:
    name: API Support
    url: https://helius.dev
servers:
  - url: https://api.helius.xyz
    description: Production server
security:
  - ApiKeyQuery: []
  - ApiKeyHeader: []
tags:
  - name: Identity
    description: Lookup wallet identities and known addresses
  - name: Balances
    description: Query token and NFT balances
  - name: History
    description: Transaction history and balance changes
  - name: Transfers
    description: Token transfer activity
  - name: Funding
    description: Wallet funding information
paths:
  /v1/wallet/{wallet}/history:
    get:
      tags:
        - History
      summary: Get transaction history
      description: >
        Retrieve transaction history for a wallet using the Enhanced
        Transactions API.

        Returns human-readable, parsed transactions with balance changes for
        each transaction.

        **Pagination is manual** - the API returns up to 100 transactions per
        request.


        Returns transactions in reverse chronological order (newest first).


        **Associated Token Accounts (ATAs):** The `tokenAccounts` parameter
        controls whether transactions

        involving token accounts owned by the wallet are included:

        - `balanceChanged` (recommended): Includes transactions that changed
        token account balances, filtering spam

        - `none`: Only direct wallet interactions

        - `all`: All token account transactions including spam


        **Pagination:** Use the `before` parameter with `pagination.nextCursor`
        to fetch the next page.

        The response includes `pagination.hasMore` to indicate if more results
        are available.

        Each request makes a single API call and costs 100 credits.
      operationId: getWalletHistory
      parameters:
        - $ref: '#/components/parameters/WalletAddress'
        - name: limit
          in: query
          description: Maximum number of transactions per request
          schema:
            type: integer
            minimum: 1
            maximum: 100
            default: 100
          example: 100
        - name: before
          in: query
          description: >-
            Fetch transactions before this signature (use
            `pagination.nextCursor` from previous response)
          schema:
            type: string
          example: 5wHu1qwD7Jsj3xqWjdSEJmYr3Q5f5RjXqjqQJ7jqEj7jqEj7jqEj7jqEj7jqEj7jqE
        - name: after
          in: query
          description: >-
            Fetch transactions after this signature (for ascending order
            pagination)
          schema:
            type: string
          example: 5wHu1qwD7Jsj3xqWjdSEJmYr3Q5f5RjXqjqQJ7jqEj7jqEj7jqEj7jqEj7jqEj7jqE
        - name: type
          in: query
          description: >
            Filter by transaction type. Available types: SWAP, TRANSFER,
            NFT_SALE, NFT_BID, NFT_LISTING,

            NFT_MINT, NFT_CANCEL_LISTING, TOKEN_MINT, BURN, COMPRESSED_NFT_MINT,
            COMPRESSED_NFT_TRANSFER,

            COMPRESSED_NFT_BURN, CREATE_STORE, WHITELIST_CREATOR,
            ADD_TO_WHITELIST, REMOVE_FROM_WHITELIST,

            AUCTION_MANAGER_CLAIM_BID, EMPTY_PAYMENT_ACCOUNT,
            UPDATE_PRIMARY_SALE_METADATA, ADD_TOKEN_TO_VAULT,

            ACTIVATE_VAULT, INIT_VAULT, INIT_BANK, INIT_STAKE, MERGE_STAKE,
            SPLIT_STAKE, CREATE_AUCTION_MANAGER,

            START_AUCTION, CREATE_AUCTION_MANAGER_V2,
            UPDATE_EXTERNAL_PRICE_ACCOUNT, EXECUTE_TRANSACTION
          schema:
            type: string
            enum:
              - SWAP
              - TRANSFER
              - NFT_SALE
              - NFT_BID
              - NFT_LISTING
              - NFT_MINT
              - NFT_CANCEL_LISTING
              - TOKEN_MINT
              - BURN
              - COMPRESSED_NFT_MINT
              - COMPRESSED_NFT_TRANSFER
              - COMPRESSED_NFT_BURN
              - CREATE_STORE
              - WHITELIST_CREATOR
              - ADD_TO_WHITELIST
              - REMOVE_FROM_WHITELIST
              - AUCTION_MANAGER_CLAIM_BID
              - EMPTY_PAYMENT_ACCOUNT
              - UPDATE_PRIMARY_SALE_METADATA
              - ADD_TOKEN_TO_VAULT
              - ACTIVATE_VAULT
              - INIT_VAULT
              - INIT_BANK
              - INIT_STAKE
              - MERGE_STAKE
              - SPLIT_STAKE
              - CREATE_AUCTION_MANAGER
              - START_AUCTION
              - CREATE_AUCTION_MANAGER_V2
              - UPDATE_EXTERNAL_PRICE_ACCOUNT
              - EXECUTE_TRANSACTION
          example: SWAP
        - name: tokenAccounts
          in: query
          description: >
            Filter transactions involving token accounts owned by the wallet.

            - `balanceChanged` (recommended): Includes transactions that changed
            token balances, filters spam

            - `none`: Only transactions directly referencing the wallet

            - `all`: All transactions including token accounts (may include
            spam)
          schema:
            type: string
            enum:
              - none
              - balanceChanged
              - all
            default: balanceChanged
          example: balanceChanged
      responses:
        '200':
          description: Transaction history retrieved successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/HistoryResponse'
        '400':
          $ref: '#/components/responses/BadRequest'
        '401':
          $ref: '#/components/responses/Unauthorized'
components:
  parameters:
    WalletAddress:
      name: wallet
      in: path
      required: true
      description: Solana wallet address (base58 encoded)
      schema:
        type: string
        pattern: ^[1-9A-HJ-NP-Za-km-z]{32,44}$
      example: GQUtvPx89ZNCwmvQqFmH59bJcU8fW8siETpaxod7Aydz
  schemas:
    HistoryResponse:
      type: object
      properties:
        data:
          type: array
          items:
            $ref: '#/components/schemas/HistoryTransaction'
        pagination:
          $ref: '#/components/schemas/Pagination'
      required:
        - data
        - pagination
    HistoryTransaction:
      type: object
      properties:
        signature:
          type: string
          description: Transaction signature
          example: 5wHu1qwD7Jsj3xqWjdSEJmYr3Q5f5RjXqjqQJ7jqEj7jqEj7jqEj7jqEj7jqEj7jqE
        timestamp:
          type: integer
          nullable: true
          description: Unix timestamp in seconds
          example: 1704067200
        slot:
          type: integer
          description: Slot number
          example: 250000000
        fee:
          type: number
          description: Transaction fee in SOL
          example: 0.000005
        feePayer:
          type: string
          description: Address that paid the transaction fee
          example: GQUtvPx89ZNCwmvQqFmH59bJcU8fW8siETpaxod7Aydz
        error:
          type: string
          nullable: true
          description: Error message if transaction failed
          example: null
        balanceChanges:
          type: array
          items:
            $ref: '#/components/schemas/BalanceChange'
          description: All balance changes in this transaction
      required:
        - signature
        - slot
        - fee
        - feePayer
        - balanceChanges
    Pagination:
      type: object
      properties:
        hasMore:
          type: boolean
          description: Whether more results are available
          example: true
        nextCursor:
          type: string
          nullable: true
          description: Cursor to fetch the next page of results
          example: 5wHu1qwD7Jsj3xqWjdSEJmYr3Q5f5RjXqjqQJ7jqEj7jqEj7jqEj7jqEj7jqEj7jqE
      required:
        - hasMore
    Error:
      type: object
      properties:
        error:
          type: string
          description: Error message
          example: Invalid wallet address
        code:
          type: integer
          description: HTTP status code
          example: 400
        details:
          type: string
          description: Additional error details
          example: '''invalid-address'' is not a valid Solana address'
      required:
        - error
        - code
    BalanceChange:
      type: object
      properties:
        mint:
          type: string
          description: Token mint address (or 'SOL' for native)
          example: So11111111111111111111111111111111111111112
        amount:
          type: number
          description: Change amount (positive for increase, negative for decrease)
          example: -0.05
        decimals:
          type: integer
          description: Token decimals
          example: 9
      required:
        - mint
        - amount
        - decimals
  responses:
    BadRequest:
      description: Invalid request parameters
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
          example:
            error: Invalid wallet address
            code: 400
            details: '''invalid-address'' is not a valid Solana address'
    Unauthorized:
      description: Missing or invalid API key
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
          example:
            error: API key required. Pass via ?api-key=xxx or X-Api-Key header
            code: 401
  securitySchemes:
    ApiKeyQuery:
      type: apiKey
      in: query
      name: api-key
      description: API key passed as query parameter
    ApiKeyHeader:
      type: apiKey
      in: header
      name: X-Api-Key
      description: API key passed in request header

````
> ## Documentation Index
> Fetch the complete documentation index at: https://www.helius.dev/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Get Wallet Transfers

> Retrieve all token transfer activity for a wallet including sender/recipient information.
Returns transfers in reverse chronological order (newest first).


## Request Parameters

<ParamField body="wallet" type="string" required>
  Solana wallet address (base58 encoded)
</ParamField>

<ParamField body="limit" type="number" default="50">
  Maximum number of transfers to return
</ParamField>

<ParamField body="cursor" type="string">
  Pagination cursor from previous response
</ParamField>


## OpenAPI

````yaml openapi/wallet-api/openapi.yaml get /v1/wallet/{wallet}/transfers
openapi: 3.0.3
info:
  title: Wallet API
  description: >
    A high-performance REST API for querying Solana wallet data including
    balances, transaction history, transfers, and identity information.


    ## Authentication


    All requests require an API key passed either as:

    - Query parameter: `?api-key=YOUR_API_KEY`

    - Header: `X-Api-Key: YOUR_API_KEY`
  version: 1.0.0
  contact:
    name: API Support
    url: https://helius.dev
servers:
  - url: https://api.helius.xyz
    description: Production server
security:
  - ApiKeyQuery: []
  - ApiKeyHeader: []
tags:
  - name: Identity
    description: Lookup wallet identities and known addresses
  - name: Balances
    description: Query token and NFT balances
  - name: History
    description: Transaction history and balance changes
  - name: Transfers
    description: Token transfer activity
  - name: Funding
    description: Wallet funding information
paths:
  /v1/wallet/{wallet}/transfers:
    get:
      tags:
        - Transfers
      summary: Get token transfers
      description: >
        Retrieve all token transfer activity for a wallet including
        sender/recipient information.

        Returns transfers in reverse chronological order (newest first).
      operationId: getWalletTransfers
      parameters:
        - $ref: '#/components/parameters/WalletAddress'
        - name: limit
          in: query
          description: Maximum number of transfers to return
          schema:
            type: integer
            minimum: 1
            maximum: 100
            default: 50
        - name: cursor
          in: query
          description: Pagination cursor from previous response
          schema:
            type: string
      responses:
        '200':
          description: Transfer history retrieved successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/TransfersResponse'
        '400':
          $ref: '#/components/responses/BadRequest'
        '401':
          $ref: '#/components/responses/Unauthorized'
components:
  parameters:
    WalletAddress:
      name: wallet
      in: path
      required: true
      description: Solana wallet address (base58 encoded)
      schema:
        type: string
        pattern: ^[1-9A-HJ-NP-Za-km-z]{32,44}$
      example: GQUtvPx89ZNCwmvQqFmH59bJcU8fW8siETpaxod7Aydz
  schemas:
    TransfersResponse:
      type: object
      properties:
        data:
          type: array
          items:
            $ref: '#/components/schemas/Transfer'
        pagination:
          $ref: '#/components/schemas/Pagination'
      required:
        - data
        - pagination
    Transfer:
      type: object
      properties:
        signature:
          type: string
          description: Transaction signature
          example: 5wHu1qwD7Jsj3xqWjdSEJmYr3Q5f5RjXqjqQJ7jqEj7jqEj7jqEj7jqEj7jqEj7jqE
        timestamp:
          type: integer
          description: Unix timestamp in seconds
          example: 1704067200
        direction:
          type: string
          enum:
            - in
            - out
          description: Transfer direction relative to the wallet
          example: in
        counterparty:
          type: string
          description: The other party in the transfer (sender if 'in', recipient if 'out')
          example: HXsKP7wrBWaQ8T2Vtjry3Nj3oUgwYcqq9vrHDM12G664
        mint:
          type: string
          description: >-
            Token mint address (So11111111111111111111111111111111111111112 for
            SOL)
          example: So11111111111111111111111111111111111111112
        symbol:
          type: string
          nullable: true
          description: Token symbol if known
          example: SOL
        amount:
          type: number
          description: Transfer amount (human-readable, divided by decimals)
          example: 1.5
        amountRaw:
          type: string
          description: >-
            Raw transfer amount in smallest unit (lamports for SOL, raw token
            amount for SPL tokens)
          example: '1500000000'
        decimals:
          type: integer
          description: Token decimals
          example: 9
      required:
        - signature
        - timestamp
        - direction
        - counterparty
        - mint
        - amount
        - amountRaw
        - decimals
    Pagination:
      type: object
      properties:
        hasMore:
          type: boolean
          description: Whether more results are available
          example: true
        nextCursor:
          type: string
          nullable: true
          description: Cursor to fetch the next page of results
          example: 5wHu1qwD7Jsj3xqWjdSEJmYr3Q5f5RjXqjqQJ7jqEj7jqEj7jqEj7jqEj7jqEj7jqE
      required:
        - hasMore
    Error:
      type: object
      properties:
        error:
          type: string
          description: Error message
          example: Invalid wallet address
        code:
          type: integer
          description: HTTP status code
          example: 400
        details:
          type: string
          description: Additional error details
          example: '''invalid-address'' is not a valid Solana address'
      required:
        - error
        - code
  responses:
    BadRequest:
      description: Invalid request parameters
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
          example:
            error: Invalid wallet address
            code: 400
            details: '''invalid-address'' is not a valid Solana address'
    Unauthorized:
      description: Missing or invalid API key
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
          example:
            error: API key required. Pass via ?api-key=xxx or X-Api-Key header
            code: 401
  securitySchemes:
    ApiKeyQuery:
      type: apiKey
      in: query
      name: api-key
      description: API key passed as query parameter
    ApiKeyHeader:
      type: apiKey
      in: header
      name: X-Api-Key
      description: API key passed in request header

````
> ## Documentation Index
> Fetch the complete documentation index at: https://www.helius.dev/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Get Wallet Funding

> Discover the original funding source of a wallet by analyzing its first incoming SOL transfer.
Useful for identifying if a wallet was funded by an exchange, another wallet, etc.


## Request Parameters

<ParamField body="wallet" type="string" required>
  Solana wallet address (base58 encoded)
</ParamField>


## OpenAPI

````yaml openapi/wallet-api/openapi.yaml get /v1/wallet/{wallet}/funded-by
openapi: 3.0.3
info:
  title: Wallet API
  description: >
    A high-performance REST API for querying Solana wallet data including
    balances, transaction history, transfers, and identity information.


    ## Authentication


    All requests require an API key passed either as:

    - Query parameter: `?api-key=YOUR_API_KEY`

    - Header: `X-Api-Key: YOUR_API_KEY`
  version: 1.0.0
  contact:
    name: API Support
    url: https://helius.dev
servers:
  - url: https://api.helius.xyz
    description: Production server
security:
  - ApiKeyQuery: []
  - ApiKeyHeader: []
tags:
  - name: Identity
    description: Lookup wallet identities and known addresses
  - name: Balances
    description: Query token and NFT balances
  - name: History
    description: Transaction history and balance changes
  - name: Transfers
    description: Token transfer activity
  - name: Funding
    description: Wallet funding information
paths:
  /v1/wallet/{wallet}/funded-by:
    get:
      tags:
        - Funding
      summary: Get wallet funding source
      description: >
        Discover the original funding source of a wallet by analyzing its first
        incoming SOL transfer.

        Useful for identifying if a wallet was funded by an exchange, another
        wallet, etc.
      operationId: getWalletFundingSource
      parameters:
        - $ref: '#/components/parameters/WalletAddress'
      responses:
        '200':
          description: Funding source identified
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/FundingSource'
        '400':
          $ref: '#/components/responses/BadRequest'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '404':
          description: No funding transaction found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
components:
  parameters:
    WalletAddress:
      name: wallet
      in: path
      required: true
      description: Solana wallet address (base58 encoded)
      schema:
        type: string
        pattern: ^[1-9A-HJ-NP-Za-km-z]{32,44}$
      example: GQUtvPx89ZNCwmvQqFmH59bJcU8fW8siETpaxod7Aydz
  schemas:
    FundingSource:
      type: object
      properties:
        funder:
          type: string
          description: Address that originally funded this wallet
          example: 2ojv9BAiHUrvsm9gxDe7fJSzbNZSJcxZvf8dqmWGHG8S
        funderName:
          type: string
          nullable: true
          description: Name of the funder if it's a known entity
          example: Coinbase 2
        funderType:
          type: string
          nullable: true
          description: Type of the funder entity
          example: exchange
        mint:
          type: string
          description: >-
            Token mint address (So11111111111111111111111111111111111111112 for
            SOL)
          example: So11111111111111111111111111111111111111112
        symbol:
          type: string
          description: Token symbol
          example: SOL
        amount:
          type: number
          description: Initial funding amount (human-readable, in SOL)
          example: 0.05
        amountRaw:
          type: string
          description: Raw funding amount in smallest unit (lamports for SOL)
          example: '50000000'
        decimals:
          type: integer
          description: Token decimals
          example: 9
        signature:
          type: string
          description: Transaction signature of the funding transfer
          example: 5wHu1qwD7Jsj3xqWjdSEJmYr3Q5f5RjXqjqQJ7jqEj7jqEj7jqEj7jqEj7jqEj7jqE
        timestamp:
          type: integer
          description: Unix timestamp in seconds
          example: 1704067200
        date:
          type: string
          format: date-time
          description: Human-readable UTC date in ISO 8601 format
          example: '2024-01-01T00:00:00.000Z'
        slot:
          type: integer
          description: Slot number
          example: 250000000
        explorerUrl:
          type: string
          description: Solana Explorer URL for the transaction
          example: >-
            https://orbmarkets.io/tx/5wHu1qwD7Jsj3xqWjdSEJmYr3Q5f5RjXqjqQJ7jqEj7jqEj7jqEj7jqEj7jqEj7jqE
      required:
        - funder
        - mint
        - symbol
        - amount
        - amountRaw
        - decimals
        - signature
        - timestamp
        - date
        - slot
        - explorerUrl
    Error:
      type: object
      properties:
        error:
          type: string
          description: Error message
          example: Invalid wallet address
        code:
          type: integer
          description: HTTP status code
          example: 400
        details:
          type: string
          description: Additional error details
          example: '''invalid-address'' is not a valid Solana address'
      required:
        - error
        - code
  responses:
    BadRequest:
      description: Invalid request parameters
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
          example:
            error: Invalid wallet address
            code: 400
            details: '''invalid-address'' is not a valid Solana address'
    Unauthorized:
      description: Missing or invalid API key
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
          example:
            error: API key required. Pass via ?api-key=xxx or X-Api-Key header
            code: 401
  securitySchemes:
    ApiKeyQuery:
      type: apiKey
      in: query
      name: api-key
      description: API key passed as query parameter
    ApiKeyHeader:
      type: apiKey
      in: header
      name: X-Api-Key
      description: API key passed in request header

````
> ## Documentation Index
> Fetch the complete documentation index at: https://www.helius.dev/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Get Enhanced Transactions

> Parse one or more Solana transaction signatures into human-readable format including NFT sales, token swaps, transfers, and DeFi operations



## OpenAPI

````yaml openapi/openapi-definition.yaml post /v0/transactions
openapi: 3.0.3
info:
  description: >-
    Comprehensive documentation for the Helius API - the leading blockchain API
    for Solana developers. Access high-performance RPC nodes, indexed data, and
    advanced blockchain features. Visit <a
    href=https://helius.xyz>helius.xyz</a> to learn more about our
    enterprise-grade infrastructure.
  version: 1.0.1
  title: Helius API
  contact:
    email: mert@helius.xyz
  license:
    name: Apache 2.0
    url: http://www.apache.org/licenses/LICENSE-2.0.html
servers:
  - url: https://api-mainnet.helius-rpc.com
    description: Mainnet RPC endpoint
  - url: https://api-devnet.helius-rpc.com
    description: Devnet RPC endpoint
security:
  - ApiKeyQuery: []
tags:
  - name: NFTs
    description: >-
      Access comprehensive NFT data including events, collection aggregations,
      real-time stats, and complete historical activity on Solana.
  - name: Tokens
    description: >-
      Complete token account data, on-chain and off-chain metadata, and detailed
      information for both fungible and non-fungible Solana tokens.
  - name: Transactions
    description: >-
      Enhanced and human-readable transaction histories with decoded instruction
      data and detailed context.
  - name: Addresses
    description: >-
      Enhanced on-chain identity data with complete wallet activity and
      ownership information.
paths:
  /v0/transactions:
    post:
      tags:
        - Transactions
      summary: >-
        Returns an array of enhanced, human-readable versions of the given
        transactions.
      description: >
        Convert raw Solana transactions into enhanced, human-readable formats
        with

        decoded instruction data and contextual information. Process multiple
        transactions

        in a single request for efficient data analysis and display.
      operationId: getEnhancedTransaction
      parameters:
        - $ref: d10a82d7-5e65-4c0b-8349-ca6fb6510ba4
        - $ref: '#/components/parameters/commitmentParam'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ParseTransactionsRequest'
      responses:
        '200':
          description: Returns an array of enhanced transactions.
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/EnhancedTransaction'
        '400':
          $ref: '#/components/responses/400-BadRequest'
        '401':
          $ref: '#/components/responses/401-Unauthorized'
        '403':
          $ref: '#/components/responses/403-Forbidden'
        '404':
          $ref: '#/components/responses/404-NotFound'
        '429':
          $ref: '#/components/responses/429-TooManyRequests'
        '500':
          $ref: '#/components/responses/500-InternalServerError'
        '503':
          $ref: '#/components/responses/503-ServiceUnavailable'
        '504':
          $ref: '#/components/responses/504-GatewayTimeout'
components:
  parameters:
    commitmentParam:
      name: commitment
      in: query
      description: >-
        How finalized a block must be to be included in the search. If not
        provided, will default to "finalized" commitment. Note that "processed"
        level commitment is not supported.
      required: false
      schema:
        $ref: '#/components/schemas/Commitment'
  schemas:
    ParseTransactionsRequest:
      type: object
      properties:
        transactions:
          type: array
          default:
            - >-
              4jzQxVTaJ4Fe4Fct9y1aaT9hmVyEjpCqE2bL8JMnuLZbzHZwaL4kZZvNEZ6bEj6fGmiAdCPjmNQHCf8v994PAgDf
          items:
            type: string
            description: The transaction IDs/signatures to parse for.
          maxItems: 100
    EnhancedTransaction:
      type: object
      properties:
        description:
          type: string
          example: Human readable interpretation of the transaction
        type:
          $ref: '#/components/schemas/TransactionType'
        source:
          $ref: '#/components/schemas/TransactionSource'
        fee:
          type: integer
          example: 5000
        feePayer:
          type: string
          example: 8cRrU1NzNpjL3k2BwjW3VixAcX6VFc29KHr4KZg8cs2Y
        signature:
          type: string
          example: >-
            yy5BT9benHhx8fGCvhcAfTtLEHAtRJ3hRTzVL16bdrTCWm63t2vapfrZQZLJC3RcuagekaXjSs2zUGQvbcto8DK
        slot:
          type: integer
          example: 148277128
        timestamp:
          type: integer
          example: 1656442333
        nativeTransfers:
          type: array
          items:
            $ref: '#/components/schemas/NativeTransfer'
        tokenTransfers:
          type: array
          items:
            $ref: '#/components/schemas/TokenTransfer'
        accountData:
          type: array
          items:
            $ref: '#/components/schemas/AccountData'
        transactionError:
          type: object
          properties:
            error:
              type: string
        instructions:
          type: array
          items:
            $ref: '#/components/schemas/Instruction'
        events:
          type: object
          properties:
            nft:
              $ref: '#/components/schemas/NFTEvent'
            swap:
              $ref: '#/components/schemas/SwapEvent'
            compressed:
              $ref: '#/components/schemas/CompressedNFTEvent'
            distributeCompressionRewards:
              $ref: '#/components/schemas/DistributeCompressionRewardsEvent'
            setAuthority:
              $ref: '#/components/schemas/SetAuthorityEvent'
          description: >-
            Events associated with this transaction. These provide fine-grained
            information about the transaction. They match the types returned
            from the event APIs.
    Commitment:
      type: string
      enum:
        - finalized
        - confirmed
    TransactionType:
      type: string
      enum:
        - ACCEPT_ESCROW_ARTIST
        - ACCEPT_ESCROW_USER
        - ACCEPT_PROPOSAL
        - ACCEPT_REQUEST_ARTIST
        - ACTIVATE_PROPOSAL
        - ACTIVATE_TRANSACTION
        - ACTIVATE_VAULT
        - ADD_AUTHORITY
        - ADD_BALANCE_LIQUIDITY
        - ADD_BATCH_TRANSACTION
        - ADD_IMBALANCE_LIQUIDITY
        - ADD_INSTRUCTION
        - ADD_ITEM
        - ADD_LIQUIDITY
        - ADD_LIQUIDITY_BY_STRATEGY
        - ADD_LIQUIDITY_BY_STRATEGY_ONE_SIDE
        - ADD_LIQUIDITY_BY_WEIGHT
        - ADD_LIQUIDITY_ONE_SIDE
        - ADD_LIQUIDITY_ONE_SIDE_PRECISE
        - ADD_MEMBER
        - ADD_MEMBER_AND_CHANGE_THRESHOLD
        - ADD_METADATA
        - ADD_PAYMENT_MINT_PAYMENT_METHOD
        - ADD_RARITIES_TO_BANK
        - ADD_REWARDS
        - ADD_SPENDING_LIMIT
        - ADD_TO_POOL
        - ADD_TO_WHITELIST
        - ADD_TOKEN_TO_VAULT
        - ADD_TRAIT_CONFLICTS
        - ADMIN_SYNC_LIQUIDITY
        - APPROVE
        - APPROVE_PROPOSAL
        - APPROVE_TRANSACTION
        - ATTACH_METADATA
        - AUCTION_HOUSE_CREATE
        - AUCTION_MANAGER_CLAIM_BID
        - AUTHORIZE_FUNDER
        - BACKFILL_TOTAL_BLOCKS
        - BEGIN_TRAIT_UPDATE
        - BEGIN_VARIANT_UPDATE
        - BOOTSTRAP_LIQUIDITY
        - BORROW_CNFT_PERPETUAL
        - BORROW_FOX
        - BORROW_OBLIGATION_LIQUIDITY
        - BORROW_PERPETUAL
        - BORROW_SOL_FOR_NFT
        - BORROW_STAKED_BANX_PERPETUAL
        - BOT_CLAIM_SALE
        - BOT_DELIST
        - BOT_LIQUIDATE
        - BOT_LIQUIDATE_SELL
        - BOT_UNFREEZE
        - BOUND_HADO_MARKET_TO_FRAKT_MARKET
        - BURN
        - BURN_NFT
        - BURN_PAYMENT
        - BURN_PAYMENT_TREE
        - BUY_ITEM
        - BUY_LOAN
        - BUY_SUBSCRIPTION
        - BUY_TICKETS
        - CANCEL
        - CANCEL_ALL_AND_PLACE_ORDERS
        - CANCEL_ALL_ORDERS
        - CANCEL_ESCROW
        - CANCEL_LOAN_REQUEST
        - CANCEL_MULTIPLE_ORDERS
        - CANCEL_OFFER
        - CANCEL_ORDER
        - CANCEL_ORDER_BY_CLIENT_ORDER_ID
        - CANCEL_PROPOSAL
        - CANCEL_REWARD
        - CANCEL_SWAP
        - CANCEL_TRANSACTION
        - CANCEL_UP_TO
        - CANCEL_UPDATE
        - CANDY_MACHINE_ROUTE
        - CANDY_MACHINE_UNWRAP
        - CANDY_MACHINE_UPDATE
        - CANDY_MACHINE_WRAP
        - CHANGE_BLOCK_BUILDER
        - CHANGE_COMIC_STATE
        - CHANGE_FEE_RECIPIENT
        - CHANGE_MARKET_STATUS
        - CHANGE_SEAT_STATUS
        - CHANGE_THRESHOLD
        - CHANGE_TIP_RECEIVER
        - CLAIM_AUTHORITY
        - CLAIM_CNFT_PERPETUAL_LOAN
        - CLAIM_FEE
        - CLAIM_NFT
        - CLAIM_NFT_BY_LENDER_CNFT
        - CLAIM_NFT_BY_LENDER_PNFT
        - CLAIM_PERPETUAL_LOAN
        - CLAIM_REWARD
        - CLAIM_REWARDS
        - CLAIM_SALE
        - CLAIM_TIPS
        - CLEAN
        - CLOSE_ACCOUNT
        - CLOSE_BATCH_ACCOUNTS
        - CLOSE_BUNDLED_POSITION
        - CLOSE_CLAIM_STATUS
        - CLOSE_CONFIG
        - CLOSE_CONFIG_TRANSACTION_ACCOUNTS
        - CLOSE_ESCROW_ACCOUNT
        - CLOSE_ITEM
        - CLOSE_MARKET
        - CLOSE_OPEN_ORDERS_ACCOUNT
        - CLOSE_OPEN_ORDERS_INDEXER
        - CLOSE_ORDER
        - CLOSE_POOL
        - CLOSE_POSITION
        - CLOSE_PRESET_PARAMETER
        - CLOSE_TIP_DISTRIBUTION_ACCOUNT
        - CLOSE_VAULT_BATCH_TRANSACTION_ACCOUNT
        - CLOSE_VAULT_TRANSACTION_ACCOUNTS
        - COLLECT_FEES
        - COLLECT_REWARD
        - COMPRESS_NFT
        - COMPRESSED_NFT_BURN
        - COMPRESSED_NFT_CANCEL_REDEEM
        - COMPRESSED_NFT_DELEGATE
        - COMPRESSED_NFT_MINT
        - COMPRESSED_NFT_REDEEM
        - COMPRESSED_NFT_SET_VERIFY_COLLECTION
        - COMPRESSED_NFT_TRANSFER
        - COMPRESSED_NFT_UNVERIFY_COLLECTION
        - COMPRESSED_NFT_UNVERIFY_CREATOR
        - COMPRESSED_NFT_UPDATE_METADATA
        - COMPRESSED_NFT_VERIFY_COLLECTION
        - COMPRESSED_NFT_VERIFY_CREATOR
        - CONSUME_EVENTS
        - CONSUME_GIVEN_EVENTS
        - COPY_CLUSTER_INFO
        - COPY_GOSSIP_CONTACT_INFO
        - COPY_TIP_DISTRIBUTION_ACCOUNT
        - COPY_VOTE_ACCOUNT
        - CRANK
        - CRANK_EVENT_QUEUE
        - CREATE
        - CREATE_AMM
        - CREATE_APPRAISAL
        - CREATE_AVATAR
        - CREATE_AVATAR_CLASS
        - CREATE_BATCH
        - CREATE_BET
        - CREATE_BOND_AND_SELL_TO_OFFERS
        - CREATE_BOND_AND_SELL_TO_OFFERS_CNFT
        - CREATE_BOND_AND_SELL_TO_OFFERS_FOR_TEST
        - CREATE_BOND_OFFER_STANDARD
        - CREATE_COLLECTION
        - CREATE_CONFIG
        - CREATE_CONFIG_TRANSACTION
        - CREATE_ESCROW
        - CREATE_LOCK_ESCROW
        - CREATE_MARKET
        - CREATE_MASTER_EDITION
        - CREATE_MERKLE_TREE
        - CREATE_MINT_METADATA
        - CREATE_MULTISIG
        - CREATE_OPEN_ORDERS_ACCOUNT
        - CREATE_OPEN_ORDERS_INDEXER
        - CREATE_ORDER
        - CREATE_PAYMENT_METHOD
        - CREATE_PERPETUAL_BOND_OFFER
        - CREATE_POOL
        - CREATE_PROPOSAL
        - CREATE_RAFFLE
        - CREATE_STATS
        - CREATE_STORE
        - CREATE_TOKEN_POOL
        - CREATE_TRAIT
        - CREATE_TRANSACTION
        - CREATE_UNCHECKED
        - CREATE_VAULT_TRANSACTION
        - DEAUTHORIZE_FUNDER
        - DECOMPRESS_NFT
        - DECREASE_LIQUIDITY
        - DELEGATE_MERKLE_TREE
        - DELETE_COLLECTION
        - DELETE_POSITION_BUNDLE
        - DELETE_REFERRER_STATE_AND_SHORT_URL
        - DELETE_TOKEN_BADGE
        - DELIST_ITEM
        - DELIST_NFT
        - DEPOSIT
        - DEPOSIT_FRACTIONAL_POOL
        - DEPOSIT_GEM
        - DEPOSIT_OBLIGATION_COLLATERAL
        - DEPOSIT_RESERVE_LIQUIDITY
        - DEPOSIT_RESERVE_LIQUIDITY_AND_OBLIGATION_COLLATERAL
        - DEPOSIT_SOL_TO_FLASH_LOAN_POOL
        - DEPOSIT_TO_BOND_OFFER_STANDARD
        - DEPOSIT_TO_FARM_VAULT
        - DEPOSIT_TO_REWARDS_VAULT
        - DISTRIBUTE_COMPRESSION_REWARDS
        - EDIT_ORDER
        - EDIT_ORDER_PEGGED
        - EMPTY_PAYMENT_ACCOUNT
        - ENABLE_OR_DISABLE_POOL
        - EQUIP_TRAIT
        - EQUIP_TRAIT_AUTHORITY
        - EVICT_SEAT
        - EXECUTE_BATCH_TRANSACTION
        - EXECUTE_CONFIG_TRANSACTION
        - EXECUTE_INSTRUCTION
        - EXECUTE_LOAN
        - EXECUTE_MORTGAGE
        - EXECUTE_TRANSACTION
        - EXECUTE_VAULT_TRANSACTION
        - EXIT_VALIDATE_AND_SELL_TO_BOND_OFFERS_V2
        - EXPIRE
        - EXTEND_LOAN
        - EXTENSION_EXECUTE
        - FILL_ORDER
        - FINALIZE_PROGRAM_INSTRUCTION
        - FINISH_HADO_MARKET
        - FIX_POOL
        - FLASH_BORROW_RESERVE_LIQUIDITY
        - FLASH_REPAY_RESERVE_LIQUIDITY
        - FORCE_CANCEL_ORDERS
        - FORECLOSE_LOAN
        - FRACTIONALIZE
        - FREEZE
        - FUND_REWARD
        - FUSE
        - GET_POOL_INFO
        - GO_TO_A_BIN
        - HARVEST_REWARD
        - IDL_MISSING_TYPES
        - INCREASE_LIQUIDITY
        - INCREASE_ORACLE_LENGTH
        - INIT_AUCTION_MANAGER_V2
        - INIT_BANK
        - INIT_CLUSTER_HISTORY_ACCOUNT
        - INIT_CONFIG
        - INIT_CONFIG_EXTENSION
        - INIT_CUSTOMIZABLE_PERMISSIONLESS_CONSTANT_PRODUCT_POOL
        - INIT_FARM
        - INIT_FARMER
        - INIT_FARMS_FOR_RESERVE
        - INIT_FEE_TIER
        - INIT_LENDING_MARKET
        - INIT_OBLIGATION
        - INIT_OBLIGATION_FARMS_FOR_RESERVE
        - INIT_PERMISSIONED_POOL
        - INIT_PERMISSIONLESS_CONSTANT_PRODUCT_POOL_WITH_CONFIG
        - INIT_PERMISSIONLESS_CONSTANT_PRODUCT_POOL_WITH_CONFIG_2
        - INIT_PERMISSIONLESS_POOL
        - INIT_PERMISSIONLESS_POOL_WITH_FEE_TIER
        - INIT_POOL
        - INIT_POOL_V2
        - INIT_POSITION_BUNDLE
        - INIT_POSITION_BUNDLE_WITH_METADATA
        - INIT_REFERRER_STATE_AND_SHORT_URL
        - INIT_REFERRER_TOKEN_STATE
        - INIT_RENT
        - INIT_RESERVE
        - INIT_REWARD
        - INIT_REWARD_V2
        - INIT_STAKE
        - INIT_SWAP
        - INIT_TICK_ARRAY
        - INIT_TIP_DISTRIBUTION_ACCOUNT
        - INIT_TOKEN_BADGE
        - INIT_USER_METADATA
        - INIT_VALIDATOR_HISTORY_ACCOUNT
        - INIT_VAULT
        - INITIALIZE
        - INITIALIZE_ACCOUNT
        - INITIALIZE_BIN_ARRAY
        - INITIALIZE_BIN_ARRAY_BITMAP_EXTENSION
        - INITIALIZE_CUSTOMIZABLE_PERMISSIONLESS_LB_PAIR
        - INITIALIZE_FARM
        - INITIALIZE_FARM_DELEGATED
        - INITIALIZE_FLASH_LOAN_POOL
        - INITIALIZE_GLOBAL_CONFIG
        - INITIALIZE_HADO_MARKET
        - INITIALIZE_LB_PAIR
        - INITIALIZE_MARKET
        - INITIALIZE_PERMISSION_LB_PAIR
        - INITIALIZE_POSITION
        - INITIALIZE_POSITION_BY_OPERATOR
        - INITIALIZE_POSITION_PDA
        - INITIALIZE_PRESET_PARAMETER
        - INITIALIZE_REWARD
        - INITIALIZE_USER
        - INSTANT_REFINANCE_PERPETUAL_LOAN
        - KICK_ITEM
        - LEND_FOR_NFT
        - LIMIT_ORDER
        - LIQUIDATE
        - LIQUIDATE_BOND_ON_AUCTION_CNFT
        - LIQUIDATE_BOND_ON_AUCTION_PNFT
        - LIQUIDATE_OBLIGATION_AND_REDEEM_RESERVE_COLLATERAL
        - LIST_ITEM
        - LIST_NFT
        - LOAN
        - LOAN_FOX
        - LOCK
        - LOCK_REWARD
        - LOG
        - MAKE_PERPETUAL_MARKET
        - MAP_BANX_TO_POINTS
        - MERGE_CONDITIONAL_TOKENS
        - MERGE_STAKE
        - MIGRATE_BIN_ARRAY
        - MIGRATE_POSITION
        - MIGRATE_TO_PNFT
        - MINT_TO
        - NAME_SUCCESSOR
        - NFT_AUCTION_CANCELLED
        - NFT_AUCTION_CREATED
        - NFT_AUCTION_UPDATED
        - NFT_BID
        - NFT_BID_CANCELLED
        - NFT_CANCEL_LISTING
        - NFT_GLOBAL_BID
        - NFT_GLOBAL_BID_CANCELLED
        - NFT_LISTING
        - NFT_MINT
        - NFT_MINT_REJECTED
        - NFT_PARTICIPATION_REWARD
        - NFT_RENT_ACTIVATE
        - NFT_RENT_CANCEL_LISTING
        - NFT_RENT_END
        - NFT_RENT_LISTING
        - NFT_RENT_UPDATE_LISTING
        - NFT_SALE
        - OFFER_LOAN
        - OPEN_BUNDLED_POSITION
        - OPEN_POSITION
        - OPEN_POSITION_WITH_METADATA
        - OVERRIDE_CURVE_PARAM
        - PARTNER_CLAIM_FEE
        - PATCH_BROKEN_USER_STAKES
        - PAUSE
        - PAYOUT
        - PLACE_AND_TAKE_PERP_ORDER
        - PLACE_BET
        - PLACE_MULTIPLE_POST_ONLY_ORDERS
        - PLACE_ORDER
        - PLACE_ORDER_PEGGED
        - PLACE_ORDERS
        - PLACE_SOL_BET
        - PLACE_TAKE_ORDER
        - PLATFORM_FEE
        - POOL_CANCEL_PROPOSAL
        - POST_MULTI_PYTH
        - POST_PYTH
        - PROGRAM_CONFIG_INIT
        - PROGRAM_CONFIG_SET_AUTH
        - PROGRAM_CONFIG_SET_CREATION_FEE
        - PROGRAM_CONFIG_SET_TREASURY
        - PROPOSE_LOAN
        - PRUNE_ORDERS
        - REALLOC_CLUSTER_HISTORY_ACCOUNT
        - REALLOC_VALIDATOR_HISTORY_ACCOUNT
        - REBORROW_SOL_FOR_NFT
        - RECORD_RARITY_POINTS
        - REDEEM_CONDITIONAL_TOKENS
        - REDEEM_FEES
        - REDEEM_RESERVE_COLLATERAL
        - REDUCE_ORDER
        - REFILL
        - REFINANCE_FBOND_BY_LENDER
        - REFINANCE_PERPETUAL_LOAN
        - REFINANCE_TO_BOND_OFFERS_V2
        - REFINANCE_TO_BOND_OFFERS_V2_CNFT
        - REFRESH_FARM
        - REFRESH_FARMER
        - REFRESH_OBLIGATION
        - REFRESH_OBLIGATION_FARMS_FOR_RESERVE
        - REFRESH_RESERVE
        - REFRESH_RESERVES_BATCH
        - REFRESH_USER_STATE
        - REJECT_PROPOSAL
        - REJECT_SWAP
        - REJECT_TRANSACTION
        - REMOVE_ALL_LIQUIDITY
        - REMOVE_BALANCE_LIQUIDITY
        - REMOVE_BOND_OFFER_V2
        - REMOVE_FROM_POOL
        - REMOVE_FROM_WHITELIST
        - REMOVE_LIQUIDITY
        - REMOVE_LIQUIDITY_BY_RANGE
        - REMOVE_LIQUIDITY_SINGLE_SIDE
        - REMOVE_MEMBER
        - REMOVE_MEMBER_AND_CHANGE_THRESHOLD
        - REMOVE_PERPETUAL_OFFER
        - REMOVE_SPENDING_LIMIT
        - REMOVE_TRAIT
        - REMOVE_TRAIT_AUTHORITY
        - REPAY
        - REPAY_CNFT_PERPETUAL_LOAN
        - REPAY_COMPRESSED
        - REPAY_FBOND_TO_TRADE_TRANSACTIONS
        - REPAY_FBOND_TO_TRADE_TRANSACTIONS_CNFT
        - REPAY_FLASH_LOAN
        - REPAY_LOAN
        - REPAY_OBLIGATION_LIQUIDITY
        - REPAY_PARTIAL_PERPETUAL_LOAN
        - REPAY_PERPETUAL_LOAN
        - REPAY_STAKED_BANX
        - REPAY_STAKED_BANX_PERPETUAL_LOAN
        - REQUEST_ELEVATION_GROUP
        - REQUEST_LOAN
        - REQUEST_PNFT_MIGRATION
        - REQUEST_SEAT
        - REQUEST_SEAT_AUTHORIZED
        - RESCIND_LOAN
        - REVOKE
        - REWARD_USER_ONCE
        - SELL_LOAN
        - SELL_NFT
        - SELL_STAKED_BANX_TO_OFFERS
        - SET_ACTIVATION_POINT
        - SET_AUTHORITY
        - SET_BANK_FLAGS
        - SET_COLLECT_PROTOCOL_FEES_AUTHORITY
        - SET_CONFIG_AUTH
        - SET_CONFIG_EXTENSION_AUTHORITY
        - SET_DEFAULT_FEE_RATE
        - SET_DEFAULT_PROTOCOL_FEE_RATE
        - SET_DELEGATE
        - SET_FEE_AUTHORITY
        - SET_FEE_RATE
        - SET_MARKET_EXPIRED
        - SET_NEW_ADMIN
        - SET_NEW_ORACLE_AUTHORITY
        - SET_NEW_TIP_DISTRIBUTION_PROGRAM
        - SET_PARAMS
        - SET_POOL_FEES
        - SET_PRE_ACTIVATION_DURATION
        - SET_PRE_ACTIVATION_SWAP_ADDRESS
        - SET_PROTOCOL_FEE_RATE
        - SET_RENT_COLLECTOR
        - SET_REWARD_AUTHORITY
        - SET_REWARD_AUTHORITY_BY_SUPER_AUTHORITY
        - SET_REWARD_EMISSIONS
        - SET_REWARD_EMISSIONS_SUPER_AUTHORITY
        - SET_REWARD_EMISSIONS_V2
        - SET_STAKE_DELEGATED
        - SET_TIME_LOCK
        - SET_TOKEN_BADGE_AUTHORITY
        - SET_VAULT_LOCK
        - SET_WHITELISTED_VAULT
        - SETTLE_CONDITIONAL_VAULT
        - SETTLE_FUNDS
        - SETTLE_FUNDS_EXPIRED
        - SETTLE_PNL
        - SOCIALIZE_LOSS
        - SPLIT_STAKE
        - STAKE
        - STAKE_BANX
        - STAKE_SOL
        - STAKE_TOKEN
        - START_PNFT_MIGRATION
        - STUB_ID_BUILD
        - STUB_ORACLE_CLOSE
        - STUB_ORACLE_CREATE
        - STUB_ORACLE_SET
        - SWAP
        - SWAP_EXACT_OUT
        - SWAP_WITH_PRICE_IMPACT
        - SWEEP_FEES
        - SWITCH_FOX
        - SWITCH_FOX_REQUEST
        - SYNC_LIQUIDITY
        - TAKE_COMPRESSED_LOAN
        - TAKE_FLASH_LOAN
        - TAKE_LOAN
        - TAKE_MORTGAGE
        - TERMINATE_PERPETUAL_LOAN
        - THAW
        - TOGGLE_PAIR_STATUS
        - TOKEN_MINT
        - TOPUP
        - TRANSFER
        - TRANSFER_OWNERSHIP
        - TRANSFER_PAYMENT
        - TRANSFER_PAYMENT_TREE
        - TRANSFER_RECIPIENT
        - UNFREEZE
        - UNKNOWN
        - UNLABELED
        - UNPAUSE
        - UNSTAKE
        - UNSTAKE_BANX
        - UNSTAKE_SOL
        - UNSTAKE_TOKEN
        - UNSUB_OR_HARVEST_WEEKS
        - UNSUB_OR_HARVEST_WEEKS_ENHANCED
        - UPDATE
        - UPDATE_ACTIVATION_POINT
        - UPDATE_BANK_MANAGER
        - UPDATE_BOND_OFFER_STANDARD
        - UPDATE_CLASS_VARIANT_AUTHORITY
        - UPDATE_CLASS_VARIANT_METADATA
        - UPDATE_COLLECTION
        - UPDATE_COLLECTION_OR_CREATOR
        - UPDATE_CONFIG
        - UPDATE_EXTERNAL_PRICE_ACCOUNT
        - UPDATE_FARM
        - UPDATE_FARM_ADMIN
        - UPDATE_FARM_CONFIG
        - UPDATE_FEE_PARAMETERS
        - UPDATE_FEES_AND_REWARDS
        - UPDATE_FLOOR
        - UPDATE_GLOBAL_CONFIG
        - UPDATE_GLOBAL_CONFIG_ADMIN
        - UPDATE_HADO_MARKET_FEE
        - UPDATE_INTEREST_PERPETUAL_MARKET
        - UPDATE_ITEM
        - UPDATE_LENDING_MARKET
        - UPDATE_LENDING_MARKET_OWNER
        - UPDATE_OFFER
        - UPDATE_ORDER
        - UPDATE_PERPETUAL_MARKET
        - UPDATE_PERPETUAL_OFFER
        - UPDATE_POOL
        - UPDATE_POOL_COLLECTIONS
        - UPDATE_POOL_MORTGAGE
        - UPDATE_POOL_STATUS
        - UPDATE_POOL_WHITELIST
        - UPDATE_POSITION_OPERATOR
        - UPDATE_PRICING_V2
        - UPDATE_PRIMARY_SALE_METADATA
        - UPDATE_RAFFLE
        - UPDATE_RECORD_AUTHORITY_DATA
        - UPDATE_RESERVE_CONFIG
        - UPDATE_REWARD_DURATION
        - UPDATE_REWARD_FUNDER
        - UPDATE_STAKE_HISTORY
        - UPDATE_STAKING_SETTINGS
        - UPDATE_STATS
        - UPDATE_TRAIT_VARIANT
        - UPDATE_TRAIT_VARIANT_AUTHORITY
        - UPDATE_TRAIT_VARIANT_METADATA
        - UPDATE_USABLE_AMOUNT
        - UPDATE_VARIANT
        - UPDATE_VAULT_OWNER
        - UPGRADE_FOX
        - UPGRADE_FOX_REQUEST
        - UPGRADE_PROGRAM_INSTRUCTION
        - UPLOAD_MERKLE_ROOT
        - USE_SPENDING_LIMIT
        - VALIDATE_SAFETY_DEPOSIT_BOX_V2
        - VERIFY_PAYMENT_MINT
        - VERIFY_PAYMENT_MINT_TEST
        - VOTE
        - WHITELIST_CREATOR
        - WITHDRAW
        - WITHDRAW_FROM_BOND_OFFER_STANDARD
        - WITHDRAW_FROM_FARM_VAULT
        - WITHDRAW_GEM
        - WITHDRAW_INELIGIBLE_REWARD
        - WITHDRAW_LIQUIDITY
        - WITHDRAW_OBLIGATION_COLLATERAL
        - WITHDRAW_OBLIGATION_COLLATERAL_AND_REDEEM_RESERVE_COLLATERAL
        - WITHDRAW_PROTOCOL_FEE
        - WITHDRAW_PROTOCOL_FEES
        - WITHDRAW_REFERRER_FEES
        - WITHDRAW_REWARD
        - WITHDRAW_REWARDS_FROM_VAULT
        - WITHDRAW_SLASHED_AMOUNT
        - WITHDRAW_SOL_FROM_FLASH_LOAN_POOL
        - WITHDRAW_TREASURY
        - WITHDRAW_UNSTAKED_DEPOSITS
    TransactionSource:
      type: string
      enum:
        - FORM_FUNCTION
        - EXCHANGE_ART
        - CANDY_MACHINE_V3
        - CANDY_MACHINE_V2
        - CANDY_MACHINE_V1
        - UNKNOWN
        - SOLANART
        - SOLSEA
        - MAGIC_EDEN
        - HOLAPLEX
        - METAPLEX
        - OPENSEA
        - SOLANA_PROGRAM_LIBRARY
        - ANCHOR
        - PHANTOM
        - SYSTEM_PROGRAM
        - STAKE_PROGRAM
        - COINBASE
        - CORAL_CUBE
        - HEDGE
        - LAUNCH_MY_NFT
        - GEM_BANK
        - GEM_FARM
        - DEGODS
        - BSL
        - YAWWW
        - ATADIA
        - DIGITAL_EYES
        - HYPERSPACE
        - TENSOR
        - BIFROST
        - JUPITER
        - MERCURIAL
        - SABER
        - SERUM
        - STEP_FINANCE
        - CROPPER
        - RAYDIUM
        - ALDRIN
        - CREMA
        - LIFINITY
        - CYKURA
        - ORCA
        - MARINADE
        - STEPN
        - SENCHA
        - SAROS
        - ENGLISH_AUCTION
        - FOXY
        - HADESWAP
        - FOXY_STAKING
        - FOXY_RAFFLE
        - FOXY_TOKEN_MARKET
        - FOXY_MISSIONS
        - FOXY_MARMALADE
        - FOXY_COINFLIP
        - FOXY_AUCTION
        - CITRUS
        - ZETA
        - ELIXIR
        - ELIXIR_LAUNCHPAD
        - CARDINAL_RENT
        - CARDINAL_STAKING
        - BPF_LOADER
        - BPF_UPGRADEABLE_LOADER
        - SQUADS
        - SHARKY_FI
        - OPEN_CREATOR_PROTOCOL
        - BUBBLEGUM
        - NOVA
        - D_READER
        - RAINDROPS
        - W_SOL
        - DUST
        - SOLI
        - USDC
        - FLWR
        - HDG
        - MEAN
        - UXD
        - SHDW
        - POLIS
        - ATLAS
        - USH
        - TRTLS
        - RUNNER
        - INVICTUS
    NativeTransfer:
      type: object
      properties:
        fromUserAccount:
          type: string
          description: The user account the sol is sent from.
        toUserAccount:
          type: string
          description: The user account the sol is sent to.
        amount:
          type: integer
          description: The amount of sol sent (in lamports).
    TokenTransfer:
      type: object
      properties:
        fromUserAccount:
          type: string
          description: The user account the tokens are sent from.
        toUserAccount:
          type: string
          description: The user account the tokens are sent to.
        fromTokenAccount:
          type: string
          description: The token account the tokens are sent from.
        toTokenAccount:
          type: string
          description: The token account the tokens are sent to.
        tokenAmount:
          type: number
          description: The number of tokens sent.
        mint:
          type: string
          example: DsfCsbbPH77p6yeLS1i4ag9UA5gP9xWSvdCx72FJjLsx
          description: The mint account of the token.
    AccountData:
      type: object
      description: >-
        Sol and token transfers involving the account are referenced in this
        object.
      properties:
        account:
          type: string
          description: The account that this data is provided for.
        nativeBalanceChange:
          type: number
          description: Native (SOL) balance change of the account.
        tokenBalanceChanges:
          type: array
          items:
            $ref: '#/components/schemas/TokenBalanceChange'
          description: Token balance changes of the account.
    Instruction:
      type: object
      description: Individual instruction data in a transaction.
      properties:
        accounts:
          type: array
          description: The accounts used in instruction.
          items:
            type: string
            example: 8uX6yiUuH4UjUb1gMGJAdkXorSuKshqsFGDCFShcK88B
        data:
          type: string
          description: Data passed into the instruction
          example: kdL8HQJrbbvQRGXmoadaja1Qvs
        programId:
          type: string
          description: Program used in instruction
          example: MEisE1HzehtrDpAAT8PnLHjpSSkRYakotTuJRPjTpo8
        innerInstructions:
          type: array
          description: Inner instructions used in instruction
          items:
            $ref: '#/components/schemas/InnerInstruction'
    NFTEvent:
      type: object
      properties:
        description:
          type: string
          description: Human readable interpretation of the transaction
        type:
          $ref: '#/components/schemas/NFTEventType'
        source:
          $ref: '#/components/schemas/TransactionSource'
        amount:
          type: integer
          example: 1000000
          description: The amount of the NFT transaction (in lamports).
        fee:
          type: integer
          example: 5000
        feePayer:
          type: string
          example: 8cRrU1NzNpjL3k2BwjW3VixAcX6VFc29KHr4KZg8cs2Y
        signature:
          type: string
          example: >-
            4jzQxVTaJ4Fe4Fct9y1aaT9hmVyEjpCqE2bL8JMnuLZbzHZwaL4kZZvNEZ6bEj6fGmiAdCPjmNQHCf8v994PAgDf
        slot:
          type: integer
          example: 148277128
        timestamp:
          type: integer
          example: 1656442333
        saleType:
          $ref: '#/components/schemas/SaleType'
        buyer:
          type: string
          description: The buyer of the NFT.
        seller:
          type: string
          description: The seller of the NFT.
        staker:
          type: string
          description: The staker of the NFT.
        nfts:
          type: array
          items:
            $ref: '#/components/schemas/Token'
          description: NFTs that are a part of this NFT event.
    SwapEvent:
      type: object
      properties:
        nativeInput:
          $ref: '#/components/schemas/NativeBalanceChange'
          description: The native input to the swap in Lamports.
        nativeOutput:
          $ref: '#/components/schemas/NativeBalanceChange'
          description: The native output of the swap in Lamports.
        tokenInputs:
          type: array
          items:
            $ref: '#/components/schemas/TokenBalanceChange'
          description: The token inputs to the swap.
        tokenOutputs:
          type: array
          items:
            $ref: '#/components/schemas/TokenBalanceChange'
          description: The token outputs of the swap.
        tokenFees:
          type: array
          items:
            $ref: '#/components/schemas/TokenBalanceChange'
          description: The token fees paid by an account.
        nativeFees:
          type: array
          items:
            $ref: '#/components/schemas/NativeBalanceChange'
          description: The native fees paid by an account.
        innerSwaps:
          type: array
          items:
            $ref: '#/components/schemas/TokenSwap'
          description: >-
            The inner swaps occurring to make this swap happen. Eg. a swap of
            wSOL <-> USDC may be make of multiple swaps from wSOL <-> DUST, DUST
            <-> USDC
    CompressedNFTEvent:
      type: object
      properties:
        type:
          $ref: '#/components/schemas/CompressedNFTEventType'
        treeId:
          type: string
          description: The address of the related merkle tree.
        assetId:
          type: string
          description: The id of the compressed nft.
        leafIndex:
          type: integer
          description: The index of the leaf being appended or modified.
        instructionIndex:
          type: integer
          description: The index of the parsed instruction in the transaction.
        innerInstructionIndex:
          type: integer
          description: The index of the parsed inner instruction in the transaction.
        newLeafOwner:
          type: string
          description: The new owner of the leaf.
        oldLeafOwner:
          type: string
          description: The previous owner of the leaf.
    DistributeCompressionRewardsEvent:
      type: object
      properties:
        amount:
          type: integer
          description: Amount transfered in the DistributeCompressionRewardsV0 instruction.
    SetAuthorityEvent:
      type: object
      properties:
        account:
          type: string
          description: Tthe account whose authority is changing.
        from:
          type: string
          description: Current authority.
        to:
          type: string
          description: New authority.
        instructionIndex:
          type: integer
          description: The index of the parsed instruction in the transaction.
        innerInstructionIndex:
          type: integer
          description: The index of the parsed inner instruction in the transaction.
    ErrorResponse:
      type: object
      description: JSON-RPC error response format
      properties:
        jsonrpc:
          type: string
          example: '2.0'
          description: JSON-RPC version
        error:
          type: object
          properties:
            code:
              type: integer
              description: Error code
              example: -32602
            message:
              type: string
              description: Error message
              example: Invalid params
        id:
          type: string
          description: Request identifier
          example: '1'
      required:
        - jsonrpc
        - error
        - id
    TokenBalanceChange:
      type: object
      properties:
        userAccount:
          type: string
          example: F54ZGuxyb2gA7vRjzWKLWEMQqCfJxDY1whtqtjdq4CJ
        tokenAccount:
          type: string
          example: 2kvmbRybhrcptDnwyNv6oiFGFEnRVv7MvVyqsxkirgdn
        mint:
          type: string
          example: DUSTawucrTsGU8hcqRdHDCbuYhCPADMLM2VcCb8VnFnQ
        rawTokenAmount:
          $ref: '#/components/schemas/RawTokenAmount'
    InnerInstruction:
      type: object
      description: Inner instructions for each instruction
      properties:
        accounts:
          type: array
          items:
            type: string
        data:
          type: string
        programId:
          type: string
    NFTEventType:
      type: string
      enum:
        - NFT_BID
        - NFT_BID_CANCELLED
        - NFT_GLOBAL_BID
        - NFT_GLOBAL_BID_CANCELLED
        - NFT_LISTING
        - NFT_CANCEL_LISTING
        - NFT_SALE
        - NFT_MINT
        - NFT_MINT_REJECTED
        - NFT_AUCTION_CREATED
        - NFT_AUCTION_UPDATED
        - NFT_AUCTION_CANCELLED
        - NFT_PARTICIPATION_REWARD
        - BURN_NFT
        - NFT_RENT_LISTING
        - NFT_RENT_CANCEL_LISTING
        - NFT_RENT_UPDATE_LISTING
        - NFT_RENT_ACTIVATE
        - NFT_RENT_END
        - ATTACH_METADATA
        - MIGRATE_TO_PNFT
        - CREATE_POOL
    SaleType:
      type: string
      enum:
        - AUCTION
        - INSTANT_SALE
        - OFFER
        - GLOBAL_OFFER
        - MINT
        - UNKNOWN
    Token:
      type: object
      properties:
        mint:
          type: string
          example: DsfCsbbPH77p6yeLS1i4ag9UA5gP9xWSvdCx72FJjLsx
          description: The mint account of the token.
        tokenStandard:
          $ref: '#/components/schemas/TokenStandard'
    NativeBalanceChange:
      type: object
      properties:
        account:
          type: string
          description: The account the native balance change is for
          example: 2uySTNgvGT2kwqpfgLiSgeBLR3wQyye1i1A2iQWoPiFr
        amount:
          type: string
          description: The amount of the balance change as a string
          example: '100000000'
    TokenSwap:
      type: object
      properties:
        tokenInputs:
          type: array
          items:
            $ref: '#/components/schemas/TokenTransfer'
          description: The token inputs of this swap.
        tokenOutputs:
          type: array
          items:
            $ref: '#/components/schemas/TokenTransfer'
          description: The token outputs of this swap.
        tokenFees:
          type: array
          items:
            $ref: '#/components/schemas/TokenTransfer'
          description: Fees charged with tokens for this swap.
        nativeFees:
          type: array
          items:
            $ref: '#/components/schemas/NativeTransfer'
          description: Fees charged in SOL for this swap.
        programInfo:
          $ref: '#/components/schemas/ProgramInfo'
          description: Information about the program creating this swap.
    CompressedNFTEventType:
      type: string
      enum:
        - CREATE_MERKLE_TREE
        - COMPRESSED_NFT_MINT
        - COMPRESSED_NFT_TRANSFER
        - COMPRESSED_NFT_REDEEM
        - COMPRESSED_NFT_CANCEL_REDEEM
        - COMPRESSED_NFT_BURN
        - COMPRESSED_NFT_DELEGATE
    RawTokenAmount:
      type: object
      properties:
        tokenAmount:
          type: string
        decimals:
          type: integer
    TokenStandard:
      type: string
      enum:
        - NonFungible
        - FungibleAsset
        - Fungible
        - NonFungibleEdition
    ProgramInfo:
      type: object
      properties:
        source:
          type: string
          example: ORCA
        account:
          type: string
          description: The account of the program
          example: whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc
        programName:
          type: string
          description: The name of the program
          example: ORCA_WHIRLPOOLS
        instructionName:
          type: string
          description: >-
            The name of the instruction creating this swap. It is the value of
            instruction name from the Anchor IDL, if it is available.
          example: whirlpoolSwap
  responses:
    400-BadRequest:
      description: Invalid request.
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponse'
          example:
            jsonrpc: '2.0'
            error:
              code: -32602
              message: Invalid params
            id: '1'
    401-Unauthorized:
      description: Unauthorized request.
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponse'
          example:
            jsonrpc: '2.0'
            error:
              code: -32001
              message: Unauthorized
            id: '1'
    403-Forbidden:
      description: Request was forbidden.
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponse'
          example:
            jsonrpc: '2.0'
            error:
              code: -32003
              message: Forbidden
            id: '1'
    404-NotFound:
      description: The specified resource was not found.
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponse'
          example:
            jsonrpc: '2.0'
            error:
              code: -32601
              message: Method not found
            id: '1'
    429-TooManyRequests:
      description: Exceeded rate limit.
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponse'
          example:
            jsonrpc: '2.0'
            error:
              code: -32005
              message: Rate limit exceeded
            id: '1'
    500-InternalServerError:
      description: >-
        The server encountered an unexpected condition that prevented it from
        fulfilling the request.
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponse'
          example:
            jsonrpc: '2.0'
            error:
              code: -32603
              message: Internal error
            id: '1'
    503-ServiceUnavailable:
      description: The service is temporarily unavailable.
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponse'
          example:
            jsonrpc: '2.0'
            error:
              code: -32002
              message: Service unavailable
            id: '1'
    504-GatewayTimeout:
      description: The request timed out.
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponse'
          example:
            jsonrpc: '2.0'
            error:
              code: -32003
              message: Gateway timeout
            id: '1'
  securitySchemes:
    ApiKeyQuery:
      type: apiKey
      in: query
      name: api-key
      description: >-
        Your Helius API key. You can get one for free in the
        [dashboard](https://dashboard.helius.dev/api-keys).

````
> ## Documentation Index
> Fetch the complete documentation index at: https://www.helius.dev/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Get Enhanced Transactions By Address

> Retrieve complete parsed transaction history for a Solana address with human-readable data, transaction type filtering, and pagination support 

## Request Parameters

<ParamField body="before-signature" type="string">
  Start searching backwards from this transaction signature.
</ParamField>

<ParamField body="after-signature" type="string">
  Start searching forwards from this transaction signature.
</ParamField>

<ParamField body="commitment" type="string">
  How finalized a block must be to be included in the search. If not provided, will default to "finalized" commitment. Note that "processed" level commitment is not supported.

  * `finalized`
  * `confirmed`
</ParamField>

<ParamField body="token-accounts" type="string" default="none">
  Filter transactions for related token accounts. Controls whether to include transactions involving token accounts owned by the address.

  * `none`
  * `balanceChanged`
  * `all`
</ParamField>

<ParamField body="sort-order" type="string" default="desc">
  The order to sort the results in.

  * `asc`
  * `desc`
</ParamField>

<ParamField body="gt-slot" type="number">
  Only return transactions with a slot greater than this value.
</ParamField>

<ParamField body="gte-slot" type="number">
  Only return transactions with a slot greater than or equal to this value.
</ParamField>

<ParamField body="lt-slot" type="number">
  Only return transactions with a slot less than this value.
</ParamField>

<ParamField body="lte-slot" type="number">
  Only return transactions with a slot less than or equal to this value.
</ParamField>

<ParamField body="gt-time" type="number">
  Only return transactions with a block time greater than this value.
</ParamField>

<ParamField body="gte-time" type="number">
  Only return transactions with a block time greater than or equal to this value.
</ParamField>

<ParamField body="lt-time" type="number">
  Only return transactions with a block time less than this value.
</ParamField>

<ParamField body="lte-time" type="number">
  Only return transactions with a block time less than or equal to this value.
</ParamField>

<ParamField body="address" type="string" required default="86xCnPeV69n6t3DnyGvkKobf9FdN2H9oiVDdaMpo2MMY">
  The address to query for.
</ParamField>

<ParamField body="source" type="string">
  The TransactionSource to filter by. For a list of possible options, see the Transaction Types section.

  * `FORM_FUNCTION`
  * `EXCHANGE_ART`
  * `CANDY_MACHINE_V3`
  * `CANDY_MACHINE_V2`
  * `CANDY_MACHINE_V1`
  * `UNKNOWN`
  * `SOLANART`
  * `SOLSEA`
  * `MAGIC_EDEN`
  * `HOLAPLEX`
  * `METAPLEX`
  * `OPENSEA`
  * `SOLANA_PROGRAM_LIBRARY`
  * `ANCHOR`
  * `PHANTOM`
  * `SYSTEM_PROGRAM`
  * `STAKE_PROGRAM`
  * `COINBASE`
  * `CORAL_CUBE`
  * `HEDGE`
  * `LAUNCH_MY_NFT`
  * `GEM_BANK`
  * `GEM_FARM`
  * `DEGODS`
  * `BSL`
  * `YAWWW`
  * `ATADIA`
  * `DIGITAL_EYES`
  * `HYPERSPACE`
  * `TENSOR`
  * `BIFROST`
  * `JUPITER`
  * `MERCURIAL`
  * `SABER`
  * `SERUM`
  * `STEP_FINANCE`
  * `CROPPER`
  * `RAYDIUM`
  * `ALDRIN`
  * `CREMA`
  * `LIFINITY`
  * `CYKURA`
  * `ORCA`
  * `MARINADE`
  * `STEPN`
  * `SENCHA`
  * `SAROS`
  * `ENGLISH_AUCTION`
  * `FOXY`
  * `HADESWAP`
  * `FOXY_STAKING`
  * `FOXY_RAFFLE`
  * `FOXY_TOKEN_MARKET`
  * `FOXY_MISSIONS`
  * `FOXY_MARMALADE`
  * `FOXY_COINFLIP`
  * `FOXY_AUCTION`
  * `CITRUS`
  * `ZETA`
  * `ELIXIR`
  * `ELIXIR_LAUNCHPAD`
  * `CARDINAL_RENT`
  * `CARDINAL_STAKING`
  * `BPF_LOADER`
  * `BPF_UPGRADEABLE_LOADER`
  * `SQUADS`
  * `SHARKY_FI`
  * `OPEN_CREATOR_PROTOCOL`
  * `BUBBLEGUM`
  * `NOVA`
  * `D_READER`
  * `RAINDROPS`
  * `W_SOL`
  * `DUST`
  * `SOLI`
  * `USDC`
  * `FLWR`
  * `HDG`
  * `MEAN`
  * `UXD`
  * `SHDW`
  * `POLIS`
  * `ATLAS`
  * `USH`
  * `TRTLS`
  * `RUNNER`
  * `INVICTUS`
</ParamField>

<ParamField body="type" type="string">
  The TransactionType to filter by. For a list of possible options, see the Transaction Types section.

  * `ACCEPT_ESCROW_ARTIST`
  * `ACCEPT_ESCROW_USER`
  * `ACCEPT_PROPOSAL`
  * `ACCEPT_REQUEST_ARTIST`
  * `ACTIVATE_PROPOSAL`
  * `ACTIVATE_TRANSACTION`
  * `ACTIVATE_VAULT`
  * `ADD_AUTHORITY`
  * `ADD_BALANCE_LIQUIDITY`
  * `ADD_BATCH_TRANSACTION`
  * `ADD_IMBALANCE_LIQUIDITY`
  * `ADD_INSTRUCTION`
  * `ADD_ITEM`
  * `ADD_LIQUIDITY`
  * `ADD_LIQUIDITY_BY_STRATEGY`
  * `ADD_LIQUIDITY_BY_STRATEGY_ONE_SIDE`
  * `ADD_LIQUIDITY_BY_WEIGHT`
  * `ADD_LIQUIDITY_ONE_SIDE`
  * `ADD_LIQUIDITY_ONE_SIDE_PRECISE`
  * `ADD_MEMBER`
  * `ADD_MEMBER_AND_CHANGE_THRESHOLD`
  * `ADD_METADATA`
  * `ADD_PAYMENT_MINT_PAYMENT_METHOD`
  * `ADD_RARITIES_TO_BANK`
  * `ADD_REWARDS`
  * `ADD_SPENDING_LIMIT`
  * `ADD_TO_POOL`
  * `ADD_TO_WHITELIST`
  * `ADD_TOKEN_TO_VAULT`
  * `ADD_TRAIT_CONFLICTS`
  * `ADMIN_SYNC_LIQUIDITY`
  * `APPROVE`
  * `APPROVE_PROPOSAL`
  * `APPROVE_TRANSACTION`
  * `ATTACH_METADATA`
  * `AUCTION_HOUSE_CREATE`
  * `AUCTION_MANAGER_CLAIM_BID`
  * `AUTHORIZE_FUNDER`
  * `BACKFILL_TOTAL_BLOCKS`
  * `BEGIN_TRAIT_UPDATE`
  * `BEGIN_VARIANT_UPDATE`
  * `BOOTSTRAP_LIQUIDITY`
  * `BORROW_CNFT_PERPETUAL`
  * `BORROW_FOX`
  * `BORROW_OBLIGATION_LIQUIDITY`
  * `BORROW_PERPETUAL`
  * `BORROW_SOL_FOR_NFT`
  * `BORROW_STAKED_BANX_PERPETUAL`
  * `BOT_CLAIM_SALE`
  * `BOT_DELIST`
  * `BOT_LIQUIDATE`
  * `BOT_LIQUIDATE_SELL`
  * `BOT_UNFREEZE`
  * `BOUND_HADO_MARKET_TO_FRAKT_MARKET`
  * `BURN`
  * `BURN_NFT`
  * `BURN_PAYMENT`
  * `BURN_PAYMENT_TREE`
  * `BUY_ITEM`
  * `BUY_LOAN`
  * `BUY_SUBSCRIPTION`
  * `BUY_TICKETS`
  * `CANCEL`
  * `CANCEL_ALL_AND_PLACE_ORDERS`
  * `CANCEL_ALL_ORDERS`
  * `CANCEL_ESCROW`
  * `CANCEL_LOAN_REQUEST`
  * `CANCEL_MULTIPLE_ORDERS`
  * `CANCEL_OFFER`
  * `CANCEL_ORDER`
  * `CANCEL_ORDER_BY_CLIENT_ORDER_ID`
  * `CANCEL_PROPOSAL`
  * `CANCEL_REWARD`
  * `CANCEL_SWAP`
  * `CANCEL_TRANSACTION`
  * `CANCEL_UP_TO`
  * `CANCEL_UPDATE`
  * `CANDY_MACHINE_ROUTE`
  * `CANDY_MACHINE_UNWRAP`
  * `CANDY_MACHINE_UPDATE`
  * `CANDY_MACHINE_WRAP`
  * `CHANGE_BLOCK_BUILDER`
  * `CHANGE_COMIC_STATE`
  * `CHANGE_FEE_RECIPIENT`
  * `CHANGE_MARKET_STATUS`
  * `CHANGE_SEAT_STATUS`
  * `CHANGE_THRESHOLD`
  * `CHANGE_TIP_RECEIVER`
  * `CLAIM_AUTHORITY`
  * `CLAIM_CNFT_PERPETUAL_LOAN`
  * `CLAIM_FEE`
  * `CLAIM_NFT`
  * `CLAIM_NFT_BY_LENDER_CNFT`
  * `CLAIM_NFT_BY_LENDER_PNFT`
  * `CLAIM_PERPETUAL_LOAN`
  * `CLAIM_REWARD`
  * `CLAIM_REWARDS`
  * `CLAIM_SALE`
  * `CLAIM_TIPS`
  * `CLEAN`
  * `CLOSE_ACCOUNT`
  * `CLOSE_BATCH_ACCOUNTS`
  * `CLOSE_BUNDLED_POSITION`
  * `CLOSE_CLAIM_STATUS`
  * `CLOSE_CONFIG`
  * `CLOSE_CONFIG_TRANSACTION_ACCOUNTS`
  * `CLOSE_ESCROW_ACCOUNT`
  * `CLOSE_ITEM`
  * `CLOSE_MARKET`
  * `CLOSE_OPEN_ORDERS_ACCOUNT`
  * `CLOSE_OPEN_ORDERS_INDEXER`
  * `CLOSE_ORDER`
  * `CLOSE_POOL`
  * `CLOSE_POSITION`
  * `CLOSE_PRESET_PARAMETER`
  * `CLOSE_TIP_DISTRIBUTION_ACCOUNT`
  * `CLOSE_VAULT_BATCH_TRANSACTION_ACCOUNT`
  * `CLOSE_VAULT_TRANSACTION_ACCOUNTS`
  * `COLLECT_FEES`
  * `COLLECT_REWARD`
  * `COMPRESS_NFT`
  * `COMPRESSED_NFT_BURN`
  * `COMPRESSED_NFT_CANCEL_REDEEM`
  * `COMPRESSED_NFT_DELEGATE`
  * `COMPRESSED_NFT_MINT`
  * `COMPRESSED_NFT_REDEEM`
  * `COMPRESSED_NFT_SET_VERIFY_COLLECTION`
  * `COMPRESSED_NFT_TRANSFER`
  * `COMPRESSED_NFT_UNVERIFY_COLLECTION`
  * `COMPRESSED_NFT_UNVERIFY_CREATOR`
  * `COMPRESSED_NFT_UPDATE_METADATA`
  * `COMPRESSED_NFT_VERIFY_COLLECTION`
  * `COMPRESSED_NFT_VERIFY_CREATOR`
  * `CONSUME_EVENTS`
  * `CONSUME_GIVEN_EVENTS`
  * `COPY_CLUSTER_INFO`
  * `COPY_GOSSIP_CONTACT_INFO`
  * `COPY_TIP_DISTRIBUTION_ACCOUNT`
  * `COPY_VOTE_ACCOUNT`
  * `CRANK`
  * `CRANK_EVENT_QUEUE`
  * `CREATE`
  * `CREATE_AMM`
  * `CREATE_APPRAISAL`
  * `CREATE_AVATAR`
  * `CREATE_AVATAR_CLASS`
  * `CREATE_BATCH`
  * `CREATE_BET`
  * `CREATE_BOND_AND_SELL_TO_OFFERS`
  * `CREATE_BOND_AND_SELL_TO_OFFERS_CNFT`
  * `CREATE_BOND_AND_SELL_TO_OFFERS_FOR_TEST`
  * `CREATE_BOND_OFFER_STANDARD`
  * `CREATE_COLLECTION`
  * `CREATE_CONFIG`
  * `CREATE_CONFIG_TRANSACTION`
  * `CREATE_ESCROW`
  * `CREATE_LOCK_ESCROW`
  * `CREATE_MARKET`
  * `CREATE_MASTER_EDITION`
  * `CREATE_MERKLE_TREE`
  * `CREATE_MINT_METADATA`
  * `CREATE_MULTISIG`
  * `CREATE_OPEN_ORDERS_ACCOUNT`
  * `CREATE_OPEN_ORDERS_INDEXER`
  * `CREATE_ORDER`
  * `CREATE_PAYMENT_METHOD`
  * `CREATE_PERPETUAL_BOND_OFFER`
  * `CREATE_POOL`
  * `CREATE_PROPOSAL`
  * `CREATE_RAFFLE`
  * `CREATE_STATS`
  * `CREATE_STORE`
  * `CREATE_TOKEN_POOL`
  * `CREATE_TRAIT`
  * `CREATE_TRANSACTION`
  * `CREATE_UNCHECKED`
  * `CREATE_VAULT_TRANSACTION`
  * `DEAUTHORIZE_FUNDER`
  * `DECOMPRESS_NFT`
  * `DECREASE_LIQUIDITY`
  * `DELEGATE_MERKLE_TREE`
  * `DELETE_COLLECTION`
  * `DELETE_POSITION_BUNDLE`
  * `DELETE_REFERRER_STATE_AND_SHORT_URL`
  * `DELETE_TOKEN_BADGE`
  * `DELIST_ITEM`
  * `DELIST_NFT`
  * `DEPOSIT`
  * `DEPOSIT_FRACTIONAL_POOL`
  * `DEPOSIT_GEM`
  * `DEPOSIT_OBLIGATION_COLLATERAL`
  * `DEPOSIT_RESERVE_LIQUIDITY`
  * `DEPOSIT_RESERVE_LIQUIDITY_AND_OBLIGATION_COLLATERAL`
  * `DEPOSIT_SOL_TO_FLASH_LOAN_POOL`
  * `DEPOSIT_TO_BOND_OFFER_STANDARD`
  * `DEPOSIT_TO_FARM_VAULT`
  * `DEPOSIT_TO_REWARDS_VAULT`
  * `DISTRIBUTE_COMPRESSION_REWARDS`
  * `EDIT_ORDER`
  * `EDIT_ORDER_PEGGED`
  * `EMPTY_PAYMENT_ACCOUNT`
  * `ENABLE_OR_DISABLE_POOL`
  * `EQUIP_TRAIT`
  * `EQUIP_TRAIT_AUTHORITY`
  * `EVICT_SEAT`
  * `EXECUTE_BATCH_TRANSACTION`
  * `EXECUTE_CONFIG_TRANSACTION`
  * `EXECUTE_INSTRUCTION`
  * `EXECUTE_LOAN`
  * `EXECUTE_MORTGAGE`
  * `EXECUTE_TRANSACTION`
  * `EXECUTE_VAULT_TRANSACTION`
  * `EXIT_VALIDATE_AND_SELL_TO_BOND_OFFERS_V2`
  * `EXPIRE`
  * `EXTEND_LOAN`
  * `EXTENSION_EXECUTE`
  * `FILL_ORDER`
  * `FINALIZE_PROGRAM_INSTRUCTION`
  * `FINISH_HADO_MARKET`
  * `FIX_POOL`
  * `FLASH_BORROW_RESERVE_LIQUIDITY`
  * `FLASH_REPAY_RESERVE_LIQUIDITY`
  * `FORCE_CANCEL_ORDERS`
  * `FORECLOSE_LOAN`
  * `FRACTIONALIZE`
  * `FREEZE`
  * `FUND_REWARD`
  * `FUSE`
  * `GET_POOL_INFO`
  * `GO_TO_A_BIN`
  * `HARVEST_REWARD`
  * `IDL_MISSING_TYPES`
  * `INCREASE_LIQUIDITY`
  * `INCREASE_ORACLE_LENGTH`
  * `INIT_AUCTION_MANAGER_V2`
  * `INIT_BANK`
  * `INIT_CLUSTER_HISTORY_ACCOUNT`
  * `INIT_CONFIG`
  * `INIT_CONFIG_EXTENSION`
  * `INIT_CUSTOMIZABLE_PERMISSIONLESS_CONSTANT_PRODUCT_POOL`
  * `INIT_FARM`
  * `INIT_FARMER`
  * `INIT_FARMS_FOR_RESERVE`
  * `INIT_FEE_TIER`
  * `INIT_LENDING_MARKET`
  * `INIT_OBLIGATION`
  * `INIT_OBLIGATION_FARMS_FOR_RESERVE`
  * `INIT_PERMISSIONED_POOL`
  * `INIT_PERMISSIONLESS_CONSTANT_PRODUCT_POOL_WITH_CONFIG`
  * `INIT_PERMISSIONLESS_CONSTANT_PRODUCT_POOL_WITH_CONFIG_2`
  * `INIT_PERMISSIONLESS_POOL`
  * `INIT_PERMISSIONLESS_POOL_WITH_FEE_TIER`
  * `INIT_POOL`
  * `INIT_POOL_V2`
  * `INIT_POSITION_BUNDLE`
  * `INIT_POSITION_BUNDLE_WITH_METADATA`
  * `INIT_REFERRER_STATE_AND_SHORT_URL`
  * `INIT_REFERRER_TOKEN_STATE`
  * `INIT_RENT`
  * `INIT_RESERVE`
  * `INIT_REWARD`
  * `INIT_REWARD_V2`
  * `INIT_STAKE`
  * `INIT_SWAP`
  * `INIT_TICK_ARRAY`
  * `INIT_TIP_DISTRIBUTION_ACCOUNT`
  * `INIT_TOKEN_BADGE`
  * `INIT_USER_METADATA`
  * `INIT_VALIDATOR_HISTORY_ACCOUNT`
  * `INIT_VAULT`
  * `INITIALIZE`
  * `INITIALIZE_ACCOUNT`
  * `INITIALIZE_BIN_ARRAY`
  * `INITIALIZE_BIN_ARRAY_BITMAP_EXTENSION`
  * `INITIALIZE_CUSTOMIZABLE_PERMISSIONLESS_LB_PAIR`
  * `INITIALIZE_FARM`
  * `INITIALIZE_FARM_DELEGATED`
  * `INITIALIZE_FLASH_LOAN_POOL`
  * `INITIALIZE_GLOBAL_CONFIG`
  * `INITIALIZE_HADO_MARKET`
  * `INITIALIZE_LB_PAIR`
  * `INITIALIZE_MARKET`
  * `INITIALIZE_PERMISSION_LB_PAIR`
  * `INITIALIZE_POSITION`
  * `INITIALIZE_POSITION_BY_OPERATOR`
  * `INITIALIZE_POSITION_PDA`
  * `INITIALIZE_PRESET_PARAMETER`
  * `INITIALIZE_REWARD`
  * `INITIALIZE_USER`
  * `INSTANT_REFINANCE_PERPETUAL_LOAN`
  * `KICK_ITEM`
  * `LEND_FOR_NFT`
  * `LIMIT_ORDER`
  * `LIQUIDATE`
  * `LIQUIDATE_BOND_ON_AUCTION_CNFT`
  * `LIQUIDATE_BOND_ON_AUCTION_PNFT`
  * `LIQUIDATE_OBLIGATION_AND_REDEEM_RESERVE_COLLATERAL`
  * `LIST_ITEM`
  * `LIST_NFT`
  * `LOAN`
  * `LOAN_FOX`
  * `LOCK`
  * `LOCK_REWARD`
  * `LOG`
  * `MAKE_PERPETUAL_MARKET`
  * `MAP_BANX_TO_POINTS`
  * `MERGE_CONDITIONAL_TOKENS`
  * `MERGE_STAKE`
  * `MIGRATE_BIN_ARRAY`
  * `MIGRATE_POSITION`
  * `MIGRATE_TO_PNFT`
  * `MINT_TO`
  * `NAME_SUCCESSOR`
  * `NFT_AUCTION_CANCELLED`
  * `NFT_AUCTION_CREATED`
  * `NFT_AUCTION_UPDATED`
  * `NFT_BID`
  * `NFT_BID_CANCELLED`
  * `NFT_CANCEL_LISTING`
  * `NFT_GLOBAL_BID`
  * `NFT_GLOBAL_BID_CANCELLED`
  * `NFT_LISTING`
  * `NFT_MINT`
  * `NFT_MINT_REJECTED`
  * `NFT_PARTICIPATION_REWARD`
  * `NFT_RENT_ACTIVATE`
  * `NFT_RENT_CANCEL_LISTING`
  * `NFT_RENT_END`
  * `NFT_RENT_LISTING`
  * `NFT_RENT_UPDATE_LISTING`
  * `NFT_SALE`
  * `OFFER_LOAN`
  * `OPEN_BUNDLED_POSITION`
  * `OPEN_POSITION`
  * `OPEN_POSITION_WITH_METADATA`
  * `OVERRIDE_CURVE_PARAM`
  * `PARTNER_CLAIM_FEE`
  * `PATCH_BROKEN_USER_STAKES`
  * `PAUSE`
  * `PAYOUT`
  * `PLACE_AND_TAKE_PERP_ORDER`
  * `PLACE_BET`
  * `PLACE_MULTIPLE_POST_ONLY_ORDERS`
  * `PLACE_ORDER`
  * `PLACE_ORDER_PEGGED`
  * `PLACE_ORDERS`
  * `PLACE_SOL_BET`
  * `PLACE_TAKE_ORDER`
  * `PLATFORM_FEE`
  * `POOL_CANCEL_PROPOSAL`
  * `POST_MULTI_PYTH`
  * `POST_PYTH`
  * `PROGRAM_CONFIG_INIT`
  * `PROGRAM_CONFIG_SET_AUTH`
  * `PROGRAM_CONFIG_SET_CREATION_FEE`
  * `PROGRAM_CONFIG_SET_TREASURY`
  * `PROPOSE_LOAN`
  * `PRUNE_ORDERS`
  * `REALLOC_CLUSTER_HISTORY_ACCOUNT`
  * `REALLOC_VALIDATOR_HISTORY_ACCOUNT`
  * `REBORROW_SOL_FOR_NFT`
  * `RECORD_RARITY_POINTS`
  * `REDEEM_CONDITIONAL_TOKENS`
  * `REDEEM_FEES`
  * `REDEEM_RESERVE_COLLATERAL`
  * `REDUCE_ORDER`
  * `REFILL`
  * `REFINANCE_FBOND_BY_LENDER`
  * `REFINANCE_PERPETUAL_LOAN`
  * `REFINANCE_TO_BOND_OFFERS_V2`
  * `REFINANCE_TO_BOND_OFFERS_V2_CNFT`
  * `REFRESH_FARM`
  * `REFRESH_FARMER`
  * `REFRESH_OBLIGATION`
  * `REFRESH_OBLIGATION_FARMS_FOR_RESERVE`
  * `REFRESH_RESERVE`
  * `REFRESH_RESERVES_BATCH`
  * `REFRESH_USER_STATE`
  * `REJECT_PROPOSAL`
  * `REJECT_SWAP`
  * `REJECT_TRANSACTION`
  * `REMOVE_ALL_LIQUIDITY`
  * `REMOVE_BALANCE_LIQUIDITY`
  * `REMOVE_BOND_OFFER_V2`
  * `REMOVE_FROM_POOL`
  * `REMOVE_FROM_WHITELIST`
  * `REMOVE_LIQUIDITY`
  * `REMOVE_LIQUIDITY_BY_RANGE`
  * `REMOVE_LIQUIDITY_SINGLE_SIDE`
  * `REMOVE_MEMBER`
  * `REMOVE_MEMBER_AND_CHANGE_THRESHOLD`
  * `REMOVE_PERPETUAL_OFFER`
  * `REMOVE_SPENDING_LIMIT`
  * `REMOVE_TRAIT`
  * `REMOVE_TRAIT_AUTHORITY`
  * `REPAY`
  * `REPAY_CNFT_PERPETUAL_LOAN`
  * `REPAY_COMPRESSED`
  * `REPAY_FBOND_TO_TRADE_TRANSACTIONS`
  * `REPAY_FBOND_TO_TRADE_TRANSACTIONS_CNFT`
  * `REPAY_FLASH_LOAN`
  * `REPAY_LOAN`
  * `REPAY_OBLIGATION_LIQUIDITY`
  * `REPAY_PARTIAL_PERPETUAL_LOAN`
  * `REPAY_PERPETUAL_LOAN`
  * `REPAY_STAKED_BANX`
  * `REPAY_STAKED_BANX_PERPETUAL_LOAN`
  * `REQUEST_ELEVATION_GROUP`
  * `REQUEST_LOAN`
  * `REQUEST_PNFT_MIGRATION`
  * `REQUEST_SEAT`
  * `REQUEST_SEAT_AUTHORIZED`
  * `RESCIND_LOAN`
  * `REVOKE`
  * `REWARD_USER_ONCE`
  * `SELL_LOAN`
  * `SELL_NFT`
  * `SELL_STAKED_BANX_TO_OFFERS`
  * `SET_ACTIVATION_POINT`
  * `SET_AUTHORITY`
  * `SET_BANK_FLAGS`
  * `SET_COLLECT_PROTOCOL_FEES_AUTHORITY`
  * `SET_CONFIG_AUTH`
  * `SET_CONFIG_EXTENSION_AUTHORITY`
  * `SET_DEFAULT_FEE_RATE`
  * `SET_DEFAULT_PROTOCOL_FEE_RATE`
  * `SET_DELEGATE`
  * `SET_FEE_AUTHORITY`
  * `SET_FEE_RATE`
  * `SET_MARKET_EXPIRED`
  * `SET_NEW_ADMIN`
  * `SET_NEW_ORACLE_AUTHORITY`
  * `SET_NEW_TIP_DISTRIBUTION_PROGRAM`
  * `SET_PARAMS`
  * `SET_POOL_FEES`
  * `SET_PRE_ACTIVATION_DURATION`
  * `SET_PRE_ACTIVATION_SWAP_ADDRESS`
  * `SET_PROTOCOL_FEE_RATE`
  * `SET_RENT_COLLECTOR`
  * `SET_REWARD_AUTHORITY`
  * `SET_REWARD_AUTHORITY_BY_SUPER_AUTHORITY`
  * `SET_REWARD_EMISSIONS`
  * `SET_REWARD_EMISSIONS_SUPER_AUTHORITY`
  * `SET_REWARD_EMISSIONS_V2`
  * `SET_STAKE_DELEGATED`
  * `SET_TIME_LOCK`
  * `SET_TOKEN_BADGE_AUTHORITY`
  * `SET_VAULT_LOCK`
  * `SET_WHITELISTED_VAULT`
  * `SETTLE_CONDITIONAL_VAULT`
  * `SETTLE_FUNDS`
  * `SETTLE_FUNDS_EXPIRED`
  * `SETTLE_PNL`
  * `SOCIALIZE_LOSS`
  * `SPLIT_STAKE`
  * `STAKE`
  * `STAKE_BANX`
  * `STAKE_SOL`
  * `STAKE_TOKEN`
  * `START_PNFT_MIGRATION`
  * `STUB_ID_BUILD`
  * `STUB_ORACLE_CLOSE`
  * `STUB_ORACLE_CREATE`
  * `STUB_ORACLE_SET`
  * `SWAP`
  * `SWAP_EXACT_OUT`
  * `SWAP_WITH_PRICE_IMPACT`
  * `SWEEP_FEES`
  * `SWITCH_FOX`
  * `SWITCH_FOX_REQUEST`
  * `SYNC_LIQUIDITY`
  * `TAKE_COMPRESSED_LOAN`
  * `TAKE_FLASH_LOAN`
  * `TAKE_LOAN`
  * `TAKE_MORTGAGE`
  * `TERMINATE_PERPETUAL_LOAN`
  * `THAW`
  * `TOGGLE_PAIR_STATUS`
  * `TOKEN_MINT`
  * `TOPUP`
  * `TRANSFER`
  * `TRANSFER_OWNERSHIP`
  * `TRANSFER_PAYMENT`
  * `TRANSFER_PAYMENT_TREE`
  * `TRANSFER_RECIPIENT`
  * `UNFREEZE`
  * `UNKNOWN`
  * `UNLABELED`
  * `UNPAUSE`
  * `UNSTAKE`
  * `UNSTAKE_BANX`
  * `UNSTAKE_SOL`
  * `UNSTAKE_TOKEN`
  * `UNSUB_OR_HARVEST_WEEKS`
  * `UNSUB_OR_HARVEST_WEEKS_ENHANCED`
  * `UPDATE`
  * `UPDATE_ACTIVATION_POINT`
  * `UPDATE_BANK_MANAGER`
  * `UPDATE_BOND_OFFER_STANDARD`
  * `UPDATE_CLASS_VARIANT_AUTHORITY`
  * `UPDATE_CLASS_VARIANT_METADATA`
  * `UPDATE_COLLECTION`
  * `UPDATE_COLLECTION_OR_CREATOR`
  * `UPDATE_CONFIG`
  * `UPDATE_EXTERNAL_PRICE_ACCOUNT`
  * `UPDATE_FARM`
  * `UPDATE_FARM_ADMIN`
  * `UPDATE_FARM_CONFIG`
  * `UPDATE_FEE_PARAMETERS`
  * `UPDATE_FEES_AND_REWARDS`
  * `UPDATE_FLOOR`
  * `UPDATE_GLOBAL_CONFIG`
  * `UPDATE_GLOBAL_CONFIG_ADMIN`
  * `UPDATE_HADO_MARKET_FEE`
  * `UPDATE_INTEREST_PERPETUAL_MARKET`
  * `UPDATE_ITEM`
  * `UPDATE_LENDING_MARKET`
  * `UPDATE_LENDING_MARKET_OWNER`
  * `UPDATE_OFFER`
  * `UPDATE_ORDER`
  * `UPDATE_PERPETUAL_MARKET`
  * `UPDATE_PERPETUAL_OFFER`
  * `UPDATE_POOL`
  * `UPDATE_POOL_COLLECTIONS`
  * `UPDATE_POOL_MORTGAGE`
  * `UPDATE_POOL_STATUS`
  * `UPDATE_POOL_WHITELIST`
  * `UPDATE_POSITION_OPERATOR`
  * `UPDATE_PRICING_V2`
  * `UPDATE_PRIMARY_SALE_METADATA`
  * `UPDATE_RAFFLE`
  * `UPDATE_RECORD_AUTHORITY_DATA`
  * `UPDATE_RESERVE_CONFIG`
  * `UPDATE_REWARD_DURATION`
  * `UPDATE_REWARD_FUNDER`
  * `UPDATE_STAKE_HISTORY`
  * `UPDATE_STAKING_SETTINGS`
  * `UPDATE_STATS`
  * `UPDATE_TRAIT_VARIANT`
  * `UPDATE_TRAIT_VARIANT_AUTHORITY`
  * `UPDATE_TRAIT_VARIANT_METADATA`
  * `UPDATE_USABLE_AMOUNT`
  * `UPDATE_VARIANT`
  * `UPDATE_VAULT_OWNER`
  * `UPGRADE_FOX`
  * `UPGRADE_FOX_REQUEST`
  * `UPGRADE_PROGRAM_INSTRUCTION`
  * `UPLOAD_MERKLE_ROOT`
  * `USE_SPENDING_LIMIT`
  * `VALIDATE_SAFETY_DEPOSIT_BOX_V2`
  * `VERIFY_PAYMENT_MINT`
  * `VERIFY_PAYMENT_MINT_TEST`
  * `VOTE`
  * `WHITELIST_CREATOR`
  * `WITHDRAW`
  * `WITHDRAW_FROM_BOND_OFFER_STANDARD`
  * `WITHDRAW_FROM_FARM_VAULT`
  * `WITHDRAW_GEM`
  * `WITHDRAW_INELIGIBLE_REWARD`
  * `WITHDRAW_LIQUIDITY`
  * `WITHDRAW_OBLIGATION_COLLATERAL`
  * `WITHDRAW_OBLIGATION_COLLATERAL_AND_REDEEM_RESERVE_COLLATERAL`
  * `WITHDRAW_PROTOCOL_FEE`
  * `WITHDRAW_PROTOCOL_FEES`
  * `WITHDRAW_REFERRER_FEES`
  * `WITHDRAW_REWARD`
  * `WITHDRAW_REWARDS_FROM_VAULT`
  * `WITHDRAW_SLASHED_AMOUNT`
  * `WITHDRAW_SOL_FROM_FLASH_LOAN_POOL`
  * `WITHDRAW_TREASURY`
  * `WITHDRAW_UNSTAKED_DEPOSITS`
</ParamField>

<ParamField body="limit" type="number">
  The number of transactions to retrieve. The value should be between 1 and 100.
</ParamField>


## OpenAPI

````yaml openapi/openapi-definition.yaml get /v0/addresses/{address}/transactions
openapi: 3.0.3
info:
  description: >-
    Comprehensive documentation for the Helius API - the leading blockchain API
    for Solana developers. Access high-performance RPC nodes, indexed data, and
    advanced blockchain features. Visit <a
    href=https://helius.xyz>helius.xyz</a> to learn more about our
    enterprise-grade infrastructure.
  version: 1.0.1
  title: Helius API
  contact:
    email: mert@helius.xyz
  license:
    name: Apache 2.0
    url: http://www.apache.org/licenses/LICENSE-2.0.html
servers:
  - url: https://api-mainnet.helius-rpc.com
    description: Mainnet RPC endpoint
  - url: https://api-devnet.helius-rpc.com
    description: Devnet RPC endpoint
security:
  - ApiKeyQuery: []
tags:
  - name: NFTs
    description: >-
      Access comprehensive NFT data including events, collection aggregations,
      real-time stats, and complete historical activity on Solana.
  - name: Tokens
    description: >-
      Complete token account data, on-chain and off-chain metadata, and detailed
      information for both fungible and non-fungible Solana tokens.
  - name: Transactions
    description: >-
      Enhanced and human-readable transaction histories with decoded instruction
      data and detailed context.
  - name: Addresses
    description: >-
      Enhanced on-chain identity data with complete wallet activity and
      ownership information.
paths:
  /v0/addresses/{address}/transactions:
    get:
      tags:
        - Transactions
      summary: Returns an enhanced transaction history for a given address
      description: >
        Access comprehensive transaction history for any Solana address with
        human-readable 

        decoded data. Filter by transaction types, sources, and time ranges to
        get detailed

        insights into wallet activity with context and decoded instructions.
      operationId: getEnhancedTransactions
      parameters:
        - $ref: d10a82d7-5e65-4c0b-8349-ca6fb6510ba4
        - $ref: '#/components/parameters/beforeSigParam'
        - $ref: '#/components/parameters/afterSigParam'
        - $ref: '#/components/parameters/commitmentParam'
        - $ref: '#/components/parameters/tokenAccountsParam'
        - $ref: '#/components/parameters/sortOrderParam'
        - $ref: '#/components/parameters/gtSlotParam'
        - $ref: '#/components/parameters/gteSlotParam'
        - $ref: '#/components/parameters/ltSlotParam'
        - $ref: '#/components/parameters/lteSlotParam'
        - $ref: '#/components/parameters/gtTimeParam'
        - $ref: '#/components/parameters/gteTimeParam'
        - $ref: '#/components/parameters/ltTimeParam'
        - $ref: '#/components/parameters/lteTimeParam'
        - $ref: '#/components/parameters/addressParam'
        - $ref: '#/components/parameters/transactionSourceParam'
        - $ref: '#/components/parameters/transactionTypeParam'
        - $ref: '#/components/parameters/limitNewParam'
      responses:
        '200':
          description: Returns an array of enhanced transactions.
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/EnhancedTransaction'
        '400':
          $ref: '#/components/responses/400-BadRequest'
        '401':
          $ref: '#/components/responses/401-Unauthorized'
        '403':
          $ref: '#/components/responses/403-Forbidden'
        '404':
          $ref: '#/components/responses/404-NotFound'
        '429':
          $ref: '#/components/responses/429-TooManyRequests'
        '500':
          $ref: '#/components/responses/500-InternalServerError'
        '503':
          $ref: '#/components/responses/503-ServiceUnavailable'
        '504':
          $ref: '#/components/responses/504-GatewayTimeout'
components:
  parameters:
    beforeSigParam:
      name: before-signature
      in: query
      description: Start searching backwards from this transaction signature.
      required: false
      schema:
        type: string
    afterSigParam:
      name: after-signature
      in: query
      description: Start searching forwards from this transaction signature.
      required: false
      schema:
        type: string
    commitmentParam:
      name: commitment
      in: query
      description: >-
        How finalized a block must be to be included in the search. If not
        provided, will default to "finalized" commitment. Note that "processed"
        level commitment is not supported.
      required: false
      schema:
        $ref: '#/components/schemas/Commitment'
    tokenAccountsParam:
      name: token-accounts
      in: query
      description: >-
        Filter transactions for related token accounts. Controls whether to
        include transactions involving token accounts owned by the address.
      required: false
      schema:
        type: string
        enum:
          - none
          - balanceChanged
          - all
        default: none
    sortOrderParam:
      name: sort-order
      in: query
      description: The order to sort the results in.
      required: false
      schema:
        type: string
        enum:
          - asc
          - desc
        default: desc
    gtSlotParam:
      name: gt-slot
      in: query
      description: Only return transactions with a slot greater than this value.
      required: false
      schema:
        type: integer
    gteSlotParam:
      name: gte-slot
      in: query
      description: >-
        Only return transactions with a slot greater than or equal to this
        value.
      required: false
      schema:
        type: integer
    ltSlotParam:
      name: lt-slot
      in: query
      description: Only return transactions with a slot less than this value.
      required: false
      schema:
        type: integer
    lteSlotParam:
      name: lte-slot
      in: query
      description: Only return transactions with a slot less than or equal to this value.
      required: false
      schema:
        type: integer
    gtTimeParam:
      name: gt-time
      in: query
      description: Only return transactions with a block time greater than this value.
      required: false
      schema:
        type: integer
    gteTimeParam:
      name: gte-time
      in: query
      description: >-
        Only return transactions with a block time greater than or equal to this
        value.
      required: false
      schema:
        type: integer
    ltTimeParam:
      name: lt-time
      in: query
      description: Only return transactions with a block time less than this value.
      required: false
      schema:
        type: integer
    lteTimeParam:
      name: lte-time
      in: query
      description: >-
        Only return transactions with a block time less than or equal to this
        value.
      required: false
      schema:
        type: integer
    addressParam:
      name: address
      in: path
      description: The address to query for.
      required: true
      schema:
        type: string
        example: 86xCnPeV69n6t3DnyGvkKobf9FdN2H9oiVDdaMpo2MMY
        default: 86xCnPeV69n6t3DnyGvkKobf9FdN2H9oiVDdaMpo2MMY
    transactionSourceParam:
      name: source
      in: query
      description: >-
        The TransactionSource to filter by. For a list of possible options, see
        the Transaction Types section.
      required: false
      schema:
        $ref: '#/components/schemas/TransactionSource'
    transactionTypeParam:
      name: type
      in: query
      description: >-
        The TransactionType to filter by. For a list of possible options, see
        the Transaction Types section.
      required: false
      schema:
        $ref: '#/components/schemas/TransactionType'
    limitNewParam:
      name: limit
      in: query
      description: >-
        The number of transactions to retrieve. The value should be between 1
        and 100.
      required: false
      schema:
        type: integer
        minimum: 1
        maximum: 100
  schemas:
    EnhancedTransaction:
      type: object
      properties:
        description:
          type: string
          example: Human readable interpretation of the transaction
        type:
          $ref: '#/components/schemas/TransactionType'
        source:
          $ref: '#/components/schemas/TransactionSource'
        fee:
          type: integer
          example: 5000
        feePayer:
          type: string
          example: 8cRrU1NzNpjL3k2BwjW3VixAcX6VFc29KHr4KZg8cs2Y
        signature:
          type: string
          example: >-
            yy5BT9benHhx8fGCvhcAfTtLEHAtRJ3hRTzVL16bdrTCWm63t2vapfrZQZLJC3RcuagekaXjSs2zUGQvbcto8DK
        slot:
          type: integer
          example: 148277128
        timestamp:
          type: integer
          example: 1656442333
        nativeTransfers:
          type: array
          items:
            $ref: '#/components/schemas/NativeTransfer'
        tokenTransfers:
          type: array
          items:
            $ref: '#/components/schemas/TokenTransfer'
        accountData:
          type: array
          items:
            $ref: '#/components/schemas/AccountData'
        transactionError:
          type: object
          properties:
            error:
              type: string
        instructions:
          type: array
          items:
            $ref: '#/components/schemas/Instruction'
        events:
          type: object
          properties:
            nft:
              $ref: '#/components/schemas/NFTEvent'
            swap:
              $ref: '#/components/schemas/SwapEvent'
            compressed:
              $ref: '#/components/schemas/CompressedNFTEvent'
            distributeCompressionRewards:
              $ref: '#/components/schemas/DistributeCompressionRewardsEvent'
            setAuthority:
              $ref: '#/components/schemas/SetAuthorityEvent'
          description: >-
            Events associated with this transaction. These provide fine-grained
            information about the transaction. They match the types returned
            from the event APIs.
    Commitment:
      type: string
      enum:
        - finalized
        - confirmed
    TransactionSource:
      type: string
      enum:
        - FORM_FUNCTION
        - EXCHANGE_ART
        - CANDY_MACHINE_V3
        - CANDY_MACHINE_V2
        - CANDY_MACHINE_V1
        - UNKNOWN
        - SOLANART
        - SOLSEA
        - MAGIC_EDEN
        - HOLAPLEX
        - METAPLEX
        - OPENSEA
        - SOLANA_PROGRAM_LIBRARY
        - ANCHOR
        - PHANTOM
        - SYSTEM_PROGRAM
        - STAKE_PROGRAM
        - COINBASE
        - CORAL_CUBE
        - HEDGE
        - LAUNCH_MY_NFT
        - GEM_BANK
        - GEM_FARM
        - DEGODS
        - BSL
        - YAWWW
        - ATADIA
        - DIGITAL_EYES
        - HYPERSPACE
        - TENSOR
        - BIFROST
        - JUPITER
        - MERCURIAL
        - SABER
        - SERUM
        - STEP_FINANCE
        - CROPPER
        - RAYDIUM
        - ALDRIN
        - CREMA
        - LIFINITY
        - CYKURA
        - ORCA
        - MARINADE
        - STEPN
        - SENCHA
        - SAROS
        - ENGLISH_AUCTION
        - FOXY
        - HADESWAP
        - FOXY_STAKING
        - FOXY_RAFFLE
        - FOXY_TOKEN_MARKET
        - FOXY_MISSIONS
        - FOXY_MARMALADE
        - FOXY_COINFLIP
        - FOXY_AUCTION
        - CITRUS
        - ZETA
        - ELIXIR
        - ELIXIR_LAUNCHPAD
        - CARDINAL_RENT
        - CARDINAL_STAKING
        - BPF_LOADER
        - BPF_UPGRADEABLE_LOADER
        - SQUADS
        - SHARKY_FI
        - OPEN_CREATOR_PROTOCOL
        - BUBBLEGUM
        - NOVA
        - D_READER
        - RAINDROPS
        - W_SOL
        - DUST
        - SOLI
        - USDC
        - FLWR
        - HDG
        - MEAN
        - UXD
        - SHDW
        - POLIS
        - ATLAS
        - USH
        - TRTLS
        - RUNNER
        - INVICTUS
    TransactionType:
      type: string
      enum:
        - ACCEPT_ESCROW_ARTIST
        - ACCEPT_ESCROW_USER
        - ACCEPT_PROPOSAL
        - ACCEPT_REQUEST_ARTIST
        - ACTIVATE_PROPOSAL
        - ACTIVATE_TRANSACTION
        - ACTIVATE_VAULT
        - ADD_AUTHORITY
        - ADD_BALANCE_LIQUIDITY
        - ADD_BATCH_TRANSACTION
        - ADD_IMBALANCE_LIQUIDITY
        - ADD_INSTRUCTION
        - ADD_ITEM
        - ADD_LIQUIDITY
        - ADD_LIQUIDITY_BY_STRATEGY
        - ADD_LIQUIDITY_BY_STRATEGY_ONE_SIDE
        - ADD_LIQUIDITY_BY_WEIGHT
        - ADD_LIQUIDITY_ONE_SIDE
        - ADD_LIQUIDITY_ONE_SIDE_PRECISE
        - ADD_MEMBER
        - ADD_MEMBER_AND_CHANGE_THRESHOLD
        - ADD_METADATA
        - ADD_PAYMENT_MINT_PAYMENT_METHOD
        - ADD_RARITIES_TO_BANK
        - ADD_REWARDS
        - ADD_SPENDING_LIMIT
        - ADD_TO_POOL
        - ADD_TO_WHITELIST
        - ADD_TOKEN_TO_VAULT
        - ADD_TRAIT_CONFLICTS
        - ADMIN_SYNC_LIQUIDITY
        - APPROVE
        - APPROVE_PROPOSAL
        - APPROVE_TRANSACTION
        - ATTACH_METADATA
        - AUCTION_HOUSE_CREATE
        - AUCTION_MANAGER_CLAIM_BID
        - AUTHORIZE_FUNDER
        - BACKFILL_TOTAL_BLOCKS
        - BEGIN_TRAIT_UPDATE
        - BEGIN_VARIANT_UPDATE
        - BOOTSTRAP_LIQUIDITY
        - BORROW_CNFT_PERPETUAL
        - BORROW_FOX
        - BORROW_OBLIGATION_LIQUIDITY
        - BORROW_PERPETUAL
        - BORROW_SOL_FOR_NFT
        - BORROW_STAKED_BANX_PERPETUAL
        - BOT_CLAIM_SALE
        - BOT_DELIST
        - BOT_LIQUIDATE
        - BOT_LIQUIDATE_SELL
        - BOT_UNFREEZE
        - BOUND_HADO_MARKET_TO_FRAKT_MARKET
        - BURN
        - BURN_NFT
        - BURN_PAYMENT
        - BURN_PAYMENT_TREE
        - BUY_ITEM
        - BUY_LOAN
        - BUY_SUBSCRIPTION
        - BUY_TICKETS
        - CANCEL
        - CANCEL_ALL_AND_PLACE_ORDERS
        - CANCEL_ALL_ORDERS
        - CANCEL_ESCROW
        - CANCEL_LOAN_REQUEST
        - CANCEL_MULTIPLE_ORDERS
        - CANCEL_OFFER
        - CANCEL_ORDER
        - CANCEL_ORDER_BY_CLIENT_ORDER_ID
        - CANCEL_PROPOSAL
        - CANCEL_REWARD
        - CANCEL_SWAP
        - CANCEL_TRANSACTION
        - CANCEL_UP_TO
        - CANCEL_UPDATE
        - CANDY_MACHINE_ROUTE
        - CANDY_MACHINE_UNWRAP
        - CANDY_MACHINE_UPDATE
        - CANDY_MACHINE_WRAP
        - CHANGE_BLOCK_BUILDER
        - CHANGE_COMIC_STATE
        - CHANGE_FEE_RECIPIENT
        - CHANGE_MARKET_STATUS
        - CHANGE_SEAT_STATUS
        - CHANGE_THRESHOLD
        - CHANGE_TIP_RECEIVER
        - CLAIM_AUTHORITY
        - CLAIM_CNFT_PERPETUAL_LOAN
        - CLAIM_FEE
        - CLAIM_NFT
        - CLAIM_NFT_BY_LENDER_CNFT
        - CLAIM_NFT_BY_LENDER_PNFT
        - CLAIM_PERPETUAL_LOAN
        - CLAIM_REWARD
        - CLAIM_REWARDS
        - CLAIM_SALE
        - CLAIM_TIPS
        - CLEAN
        - CLOSE_ACCOUNT
        - CLOSE_BATCH_ACCOUNTS
        - CLOSE_BUNDLED_POSITION
        - CLOSE_CLAIM_STATUS
        - CLOSE_CONFIG
        - CLOSE_CONFIG_TRANSACTION_ACCOUNTS
        - CLOSE_ESCROW_ACCOUNT
        - CLOSE_ITEM
        - CLOSE_MARKET
        - CLOSE_OPEN_ORDERS_ACCOUNT
        - CLOSE_OPEN_ORDERS_INDEXER
        - CLOSE_ORDER
        - CLOSE_POOL
        - CLOSE_POSITION
        - CLOSE_PRESET_PARAMETER
        - CLOSE_TIP_DISTRIBUTION_ACCOUNT
        - CLOSE_VAULT_BATCH_TRANSACTION_ACCOUNT
        - CLOSE_VAULT_TRANSACTION_ACCOUNTS
        - COLLECT_FEES
        - COLLECT_REWARD
        - COMPRESS_NFT
        - COMPRESSED_NFT_BURN
        - COMPRESSED_NFT_CANCEL_REDEEM
        - COMPRESSED_NFT_DELEGATE
        - COMPRESSED_NFT_MINT
        - COMPRESSED_NFT_REDEEM
        - COMPRESSED_NFT_SET_VERIFY_COLLECTION
        - COMPRESSED_NFT_TRANSFER
        - COMPRESSED_NFT_UNVERIFY_COLLECTION
        - COMPRESSED_NFT_UNVERIFY_CREATOR
        - COMPRESSED_NFT_UPDATE_METADATA
        - COMPRESSED_NFT_VERIFY_COLLECTION
        - COMPRESSED_NFT_VERIFY_CREATOR
        - CONSUME_EVENTS
        - CONSUME_GIVEN_EVENTS
        - COPY_CLUSTER_INFO
        - COPY_GOSSIP_CONTACT_INFO
        - COPY_TIP_DISTRIBUTION_ACCOUNT
        - COPY_VOTE_ACCOUNT
        - CRANK
        - CRANK_EVENT_QUEUE
        - CREATE
        - CREATE_AMM
        - CREATE_APPRAISAL
        - CREATE_AVATAR
        - CREATE_AVATAR_CLASS
        - CREATE_BATCH
        - CREATE_BET
        - CREATE_BOND_AND_SELL_TO_OFFERS
        - CREATE_BOND_AND_SELL_TO_OFFERS_CNFT
        - CREATE_BOND_AND_SELL_TO_OFFERS_FOR_TEST
        - CREATE_BOND_OFFER_STANDARD
        - CREATE_COLLECTION
        - CREATE_CONFIG
        - CREATE_CONFIG_TRANSACTION
        - CREATE_ESCROW
        - CREATE_LOCK_ESCROW
        - CREATE_MARKET
        - CREATE_MASTER_EDITION
        - CREATE_MERKLE_TREE
        - CREATE_MINT_METADATA
        - CREATE_MULTISIG
        - CREATE_OPEN_ORDERS_ACCOUNT
        - CREATE_OPEN_ORDERS_INDEXER
        - CREATE_ORDER
        - CREATE_PAYMENT_METHOD
        - CREATE_PERPETUAL_BOND_OFFER
        - CREATE_POOL
        - CREATE_PROPOSAL
        - CREATE_RAFFLE
        - CREATE_STATS
        - CREATE_STORE
        - CREATE_TOKEN_POOL
        - CREATE_TRAIT
        - CREATE_TRANSACTION
        - CREATE_UNCHECKED
        - CREATE_VAULT_TRANSACTION
        - DEAUTHORIZE_FUNDER
        - DECOMPRESS_NFT
        - DECREASE_LIQUIDITY
        - DELEGATE_MERKLE_TREE
        - DELETE_COLLECTION
        - DELETE_POSITION_BUNDLE
        - DELETE_REFERRER_STATE_AND_SHORT_URL
        - DELETE_TOKEN_BADGE
        - DELIST_ITEM
        - DELIST_NFT
        - DEPOSIT
        - DEPOSIT_FRACTIONAL_POOL
        - DEPOSIT_GEM
        - DEPOSIT_OBLIGATION_COLLATERAL
        - DEPOSIT_RESERVE_LIQUIDITY
        - DEPOSIT_RESERVE_LIQUIDITY_AND_OBLIGATION_COLLATERAL
        - DEPOSIT_SOL_TO_FLASH_LOAN_POOL
        - DEPOSIT_TO_BOND_OFFER_STANDARD
        - DEPOSIT_TO_FARM_VAULT
        - DEPOSIT_TO_REWARDS_VAULT
        - DISTRIBUTE_COMPRESSION_REWARDS
        - EDIT_ORDER
        - EDIT_ORDER_PEGGED
        - EMPTY_PAYMENT_ACCOUNT
        - ENABLE_OR_DISABLE_POOL
        - EQUIP_TRAIT
        - EQUIP_TRAIT_AUTHORITY
        - EVICT_SEAT
        - EXECUTE_BATCH_TRANSACTION
        - EXECUTE_CONFIG_TRANSACTION
        - EXECUTE_INSTRUCTION
        - EXECUTE_LOAN
        - EXECUTE_MORTGAGE
        - EXECUTE_TRANSACTION
        - EXECUTE_VAULT_TRANSACTION
        - EXIT_VALIDATE_AND_SELL_TO_BOND_OFFERS_V2
        - EXPIRE
        - EXTEND_LOAN
        - EXTENSION_EXECUTE
        - FILL_ORDER
        - FINALIZE_PROGRAM_INSTRUCTION
        - FINISH_HADO_MARKET
        - FIX_POOL
        - FLASH_BORROW_RESERVE_LIQUIDITY
        - FLASH_REPAY_RESERVE_LIQUIDITY
        - FORCE_CANCEL_ORDERS
        - FORECLOSE_LOAN
        - FRACTIONALIZE
        - FREEZE
        - FUND_REWARD
        - FUSE
        - GET_POOL_INFO
        - GO_TO_A_BIN
        - HARVEST_REWARD
        - IDL_MISSING_TYPES
        - INCREASE_LIQUIDITY
        - INCREASE_ORACLE_LENGTH
        - INIT_AUCTION_MANAGER_V2
        - INIT_BANK
        - INIT_CLUSTER_HISTORY_ACCOUNT
        - INIT_CONFIG
        - INIT_CONFIG_EXTENSION
        - INIT_CUSTOMIZABLE_PERMISSIONLESS_CONSTANT_PRODUCT_POOL
        - INIT_FARM
        - INIT_FARMER
        - INIT_FARMS_FOR_RESERVE
        - INIT_FEE_TIER
        - INIT_LENDING_MARKET
        - INIT_OBLIGATION
        - INIT_OBLIGATION_FARMS_FOR_RESERVE
        - INIT_PERMISSIONED_POOL
        - INIT_PERMISSIONLESS_CONSTANT_PRODUCT_POOL_WITH_CONFIG
        - INIT_PERMISSIONLESS_CONSTANT_PRODUCT_POOL_WITH_CONFIG_2
        - INIT_PERMISSIONLESS_POOL
        - INIT_PERMISSIONLESS_POOL_WITH_FEE_TIER
        - INIT_POOL
        - INIT_POOL_V2
        - INIT_POSITION_BUNDLE
        - INIT_POSITION_BUNDLE_WITH_METADATA
        - INIT_REFERRER_STATE_AND_SHORT_URL
        - INIT_REFERRER_TOKEN_STATE
        - INIT_RENT
        - INIT_RESERVE
        - INIT_REWARD
        - INIT_REWARD_V2
        - INIT_STAKE
        - INIT_SWAP
        - INIT_TICK_ARRAY
        - INIT_TIP_DISTRIBUTION_ACCOUNT
        - INIT_TOKEN_BADGE
        - INIT_USER_METADATA
        - INIT_VALIDATOR_HISTORY_ACCOUNT
        - INIT_VAULT
        - INITIALIZE
        - INITIALIZE_ACCOUNT
        - INITIALIZE_BIN_ARRAY
        - INITIALIZE_BIN_ARRAY_BITMAP_EXTENSION
        - INITIALIZE_CUSTOMIZABLE_PERMISSIONLESS_LB_PAIR
        - INITIALIZE_FARM
        - INITIALIZE_FARM_DELEGATED
        - INITIALIZE_FLASH_LOAN_POOL
        - INITIALIZE_GLOBAL_CONFIG
        - INITIALIZE_HADO_MARKET
        - INITIALIZE_LB_PAIR
        - INITIALIZE_MARKET
        - INITIALIZE_PERMISSION_LB_PAIR
        - INITIALIZE_POSITION
        - INITIALIZE_POSITION_BY_OPERATOR
        - INITIALIZE_POSITION_PDA
        - INITIALIZE_PRESET_PARAMETER
        - INITIALIZE_REWARD
        - INITIALIZE_USER
        - INSTANT_REFINANCE_PERPETUAL_LOAN
        - KICK_ITEM
        - LEND_FOR_NFT
        - LIMIT_ORDER
        - LIQUIDATE
        - LIQUIDATE_BOND_ON_AUCTION_CNFT
        - LIQUIDATE_BOND_ON_AUCTION_PNFT
        - LIQUIDATE_OBLIGATION_AND_REDEEM_RESERVE_COLLATERAL
        - LIST_ITEM
        - LIST_NFT
        - LOAN
        - LOAN_FOX
        - LOCK
        - LOCK_REWARD
        - LOG
        - MAKE_PERPETUAL_MARKET
        - MAP_BANX_TO_POINTS
        - MERGE_CONDITIONAL_TOKENS
        - MERGE_STAKE
        - MIGRATE_BIN_ARRAY
        - MIGRATE_POSITION
        - MIGRATE_TO_PNFT
        - MINT_TO
        - NAME_SUCCESSOR
        - NFT_AUCTION_CANCELLED
        - NFT_AUCTION_CREATED
        - NFT_AUCTION_UPDATED
        - NFT_BID
        - NFT_BID_CANCELLED
        - NFT_CANCEL_LISTING
        - NFT_GLOBAL_BID
        - NFT_GLOBAL_BID_CANCELLED
        - NFT_LISTING
        - NFT_MINT
        - NFT_MINT_REJECTED
        - NFT_PARTICIPATION_REWARD
        - NFT_RENT_ACTIVATE
        - NFT_RENT_CANCEL_LISTING
        - NFT_RENT_END
        - NFT_RENT_LISTING
        - NFT_RENT_UPDATE_LISTING
        - NFT_SALE
        - OFFER_LOAN
        - OPEN_BUNDLED_POSITION
        - OPEN_POSITION
        - OPEN_POSITION_WITH_METADATA
        - OVERRIDE_CURVE_PARAM
        - PARTNER_CLAIM_FEE
        - PATCH_BROKEN_USER_STAKES
        - PAUSE
        - PAYOUT
        - PLACE_AND_TAKE_PERP_ORDER
        - PLACE_BET
        - PLACE_MULTIPLE_POST_ONLY_ORDERS
        - PLACE_ORDER
        - PLACE_ORDER_PEGGED
        - PLACE_ORDERS
        - PLACE_SOL_BET
        - PLACE_TAKE_ORDER
        - PLATFORM_FEE
        - POOL_CANCEL_PROPOSAL
        - POST_MULTI_PYTH
        - POST_PYTH
        - PROGRAM_CONFIG_INIT
        - PROGRAM_CONFIG_SET_AUTH
        - PROGRAM_CONFIG_SET_CREATION_FEE
        - PROGRAM_CONFIG_SET_TREASURY
        - PROPOSE_LOAN
        - PRUNE_ORDERS
        - REALLOC_CLUSTER_HISTORY_ACCOUNT
        - REALLOC_VALIDATOR_HISTORY_ACCOUNT
        - REBORROW_SOL_FOR_NFT
        - RECORD_RARITY_POINTS
        - REDEEM_CONDITIONAL_TOKENS
        - REDEEM_FEES
        - REDEEM_RESERVE_COLLATERAL
        - REDUCE_ORDER
        - REFILL
        - REFINANCE_FBOND_BY_LENDER
        - REFINANCE_PERPETUAL_LOAN
        - REFINANCE_TO_BOND_OFFERS_V2
        - REFINANCE_TO_BOND_OFFERS_V2_CNFT
        - REFRESH_FARM
        - REFRESH_FARMER
        - REFRESH_OBLIGATION
        - REFRESH_OBLIGATION_FARMS_FOR_RESERVE
        - REFRESH_RESERVE
        - REFRESH_RESERVES_BATCH
        - REFRESH_USER_STATE
        - REJECT_PROPOSAL
        - REJECT_SWAP
        - REJECT_TRANSACTION
        - REMOVE_ALL_LIQUIDITY
        - REMOVE_BALANCE_LIQUIDITY
        - REMOVE_BOND_OFFER_V2
        - REMOVE_FROM_POOL
        - REMOVE_FROM_WHITELIST
        - REMOVE_LIQUIDITY
        - REMOVE_LIQUIDITY_BY_RANGE
        - REMOVE_LIQUIDITY_SINGLE_SIDE
        - REMOVE_MEMBER
        - REMOVE_MEMBER_AND_CHANGE_THRESHOLD
        - REMOVE_PERPETUAL_OFFER
        - REMOVE_SPENDING_LIMIT
        - REMOVE_TRAIT
        - REMOVE_TRAIT_AUTHORITY
        - REPAY
        - REPAY_CNFT_PERPETUAL_LOAN
        - REPAY_COMPRESSED
        - REPAY_FBOND_TO_TRADE_TRANSACTIONS
        - REPAY_FBOND_TO_TRADE_TRANSACTIONS_CNFT
        - REPAY_FLASH_LOAN
        - REPAY_LOAN
        - REPAY_OBLIGATION_LIQUIDITY
        - REPAY_PARTIAL_PERPETUAL_LOAN
        - REPAY_PERPETUAL_LOAN
        - REPAY_STAKED_BANX
        - REPAY_STAKED_BANX_PERPETUAL_LOAN
        - REQUEST_ELEVATION_GROUP
        - REQUEST_LOAN
        - REQUEST_PNFT_MIGRATION
        - REQUEST_SEAT
        - REQUEST_SEAT_AUTHORIZED
        - RESCIND_LOAN
        - REVOKE
        - REWARD_USER_ONCE
        - SELL_LOAN
        - SELL_NFT
        - SELL_STAKED_BANX_TO_OFFERS
        - SET_ACTIVATION_POINT
        - SET_AUTHORITY
        - SET_BANK_FLAGS
        - SET_COLLECT_PROTOCOL_FEES_AUTHORITY
        - SET_CONFIG_AUTH
        - SET_CONFIG_EXTENSION_AUTHORITY
        - SET_DEFAULT_FEE_RATE
        - SET_DEFAULT_PROTOCOL_FEE_RATE
        - SET_DELEGATE
        - SET_FEE_AUTHORITY
        - SET_FEE_RATE
        - SET_MARKET_EXPIRED
        - SET_NEW_ADMIN
        - SET_NEW_ORACLE_AUTHORITY
        - SET_NEW_TIP_DISTRIBUTION_PROGRAM
        - SET_PARAMS
        - SET_POOL_FEES
        - SET_PRE_ACTIVATION_DURATION
        - SET_PRE_ACTIVATION_SWAP_ADDRESS
        - SET_PROTOCOL_FEE_RATE
        - SET_RENT_COLLECTOR
        - SET_REWARD_AUTHORITY
        - SET_REWARD_AUTHORITY_BY_SUPER_AUTHORITY
        - SET_REWARD_EMISSIONS
        - SET_REWARD_EMISSIONS_SUPER_AUTHORITY
        - SET_REWARD_EMISSIONS_V2
        - SET_STAKE_DELEGATED
        - SET_TIME_LOCK
        - SET_TOKEN_BADGE_AUTHORITY
        - SET_VAULT_LOCK
        - SET_WHITELISTED_VAULT
        - SETTLE_CONDITIONAL_VAULT
        - SETTLE_FUNDS
        - SETTLE_FUNDS_EXPIRED
        - SETTLE_PNL
        - SOCIALIZE_LOSS
        - SPLIT_STAKE
        - STAKE
        - STAKE_BANX
        - STAKE_SOL
        - STAKE_TOKEN
        - START_PNFT_MIGRATION
        - STUB_ID_BUILD
        - STUB_ORACLE_CLOSE
        - STUB_ORACLE_CREATE
        - STUB_ORACLE_SET
        - SWAP
        - SWAP_EXACT_OUT
        - SWAP_WITH_PRICE_IMPACT
        - SWEEP_FEES
        - SWITCH_FOX
        - SWITCH_FOX_REQUEST
        - SYNC_LIQUIDITY
        - TAKE_COMPRESSED_LOAN
        - TAKE_FLASH_LOAN
        - TAKE_LOAN
        - TAKE_MORTGAGE
        - TERMINATE_PERPETUAL_LOAN
        - THAW
        - TOGGLE_PAIR_STATUS
        - TOKEN_MINT
        - TOPUP
        - TRANSFER
        - TRANSFER_OWNERSHIP
        - TRANSFER_PAYMENT
        - TRANSFER_PAYMENT_TREE
        - TRANSFER_RECIPIENT
        - UNFREEZE
        - UNKNOWN
        - UNLABELED
        - UNPAUSE
        - UNSTAKE
        - UNSTAKE_BANX
        - UNSTAKE_SOL
        - UNSTAKE_TOKEN
        - UNSUB_OR_HARVEST_WEEKS
        - UNSUB_OR_HARVEST_WEEKS_ENHANCED
        - UPDATE
        - UPDATE_ACTIVATION_POINT
        - UPDATE_BANK_MANAGER
        - UPDATE_BOND_OFFER_STANDARD
        - UPDATE_CLASS_VARIANT_AUTHORITY
        - UPDATE_CLASS_VARIANT_METADATA
        - UPDATE_COLLECTION
        - UPDATE_COLLECTION_OR_CREATOR
        - UPDATE_CONFIG
        - UPDATE_EXTERNAL_PRICE_ACCOUNT
        - UPDATE_FARM
        - UPDATE_FARM_ADMIN
        - UPDATE_FARM_CONFIG
        - UPDATE_FEE_PARAMETERS
        - UPDATE_FEES_AND_REWARDS
        - UPDATE_FLOOR
        - UPDATE_GLOBAL_CONFIG
        - UPDATE_GLOBAL_CONFIG_ADMIN
        - UPDATE_HADO_MARKET_FEE
        - UPDATE_INTEREST_PERPETUAL_MARKET
        - UPDATE_ITEM
        - UPDATE_LENDING_MARKET
        - UPDATE_LENDING_MARKET_OWNER
        - UPDATE_OFFER
        - UPDATE_ORDER
        - UPDATE_PERPETUAL_MARKET
        - UPDATE_PERPETUAL_OFFER
        - UPDATE_POOL
        - UPDATE_POOL_COLLECTIONS
        - UPDATE_POOL_MORTGAGE
        - UPDATE_POOL_STATUS
        - UPDATE_POOL_WHITELIST
        - UPDATE_POSITION_OPERATOR
        - UPDATE_PRICING_V2
        - UPDATE_PRIMARY_SALE_METADATA
        - UPDATE_RAFFLE
        - UPDATE_RECORD_AUTHORITY_DATA
        - UPDATE_RESERVE_CONFIG
        - UPDATE_REWARD_DURATION
        - UPDATE_REWARD_FUNDER
        - UPDATE_STAKE_HISTORY
        - UPDATE_STAKING_SETTINGS
        - UPDATE_STATS
        - UPDATE_TRAIT_VARIANT
        - UPDATE_TRAIT_VARIANT_AUTHORITY
        - UPDATE_TRAIT_VARIANT_METADATA
        - UPDATE_USABLE_AMOUNT
        - UPDATE_VARIANT
        - UPDATE_VAULT_OWNER
        - UPGRADE_FOX
        - UPGRADE_FOX_REQUEST
        - UPGRADE_PROGRAM_INSTRUCTION
        - UPLOAD_MERKLE_ROOT
        - USE_SPENDING_LIMIT
        - VALIDATE_SAFETY_DEPOSIT_BOX_V2
        - VERIFY_PAYMENT_MINT
        - VERIFY_PAYMENT_MINT_TEST
        - VOTE
        - WHITELIST_CREATOR
        - WITHDRAW
        - WITHDRAW_FROM_BOND_OFFER_STANDARD
        - WITHDRAW_FROM_FARM_VAULT
        - WITHDRAW_GEM
        - WITHDRAW_INELIGIBLE_REWARD
        - WITHDRAW_LIQUIDITY
        - WITHDRAW_OBLIGATION_COLLATERAL
        - WITHDRAW_OBLIGATION_COLLATERAL_AND_REDEEM_RESERVE_COLLATERAL
        - WITHDRAW_PROTOCOL_FEE
        - WITHDRAW_PROTOCOL_FEES
        - WITHDRAW_REFERRER_FEES
        - WITHDRAW_REWARD
        - WITHDRAW_REWARDS_FROM_VAULT
        - WITHDRAW_SLASHED_AMOUNT
        - WITHDRAW_SOL_FROM_FLASH_LOAN_POOL
        - WITHDRAW_TREASURY
        - WITHDRAW_UNSTAKED_DEPOSITS
    NativeTransfer:
      type: object
      properties:
        fromUserAccount:
          type: string
          description: The user account the sol is sent from.
        toUserAccount:
          type: string
          description: The user account the sol is sent to.
        amount:
          type: integer
          description: The amount of sol sent (in lamports).
    TokenTransfer:
      type: object
      properties:
        fromUserAccount:
          type: string
          description: The user account the tokens are sent from.
        toUserAccount:
          type: string
          description: The user account the tokens are sent to.
        fromTokenAccount:
          type: string
          description: The token account the tokens are sent from.
        toTokenAccount:
          type: string
          description: The token account the tokens are sent to.
        tokenAmount:
          type: number
          description: The number of tokens sent.
        mint:
          type: string
          example: DsfCsbbPH77p6yeLS1i4ag9UA5gP9xWSvdCx72FJjLsx
          description: The mint account of the token.
    AccountData:
      type: object
      description: >-
        Sol and token transfers involving the account are referenced in this
        object.
      properties:
        account:
          type: string
          description: The account that this data is provided for.
        nativeBalanceChange:
          type: number
          description: Native (SOL) balance change of the account.
        tokenBalanceChanges:
          type: array
          items:
            $ref: '#/components/schemas/TokenBalanceChange'
          description: Token balance changes of the account.
    Instruction:
      type: object
      description: Individual instruction data in a transaction.
      properties:
        accounts:
          type: array
          description: The accounts used in instruction.
          items:
            type: string
            example: 8uX6yiUuH4UjUb1gMGJAdkXorSuKshqsFGDCFShcK88B
        data:
          type: string
          description: Data passed into the instruction
          example: kdL8HQJrbbvQRGXmoadaja1Qvs
        programId:
          type: string
          description: Program used in instruction
          example: MEisE1HzehtrDpAAT8PnLHjpSSkRYakotTuJRPjTpo8
        innerInstructions:
          type: array
          description: Inner instructions used in instruction
          items:
            $ref: '#/components/schemas/InnerInstruction'
    NFTEvent:
      type: object
      properties:
        description:
          type: string
          description: Human readable interpretation of the transaction
        type:
          $ref: '#/components/schemas/NFTEventType'
        source:
          $ref: '#/components/schemas/TransactionSource'
        amount:
          type: integer
          example: 1000000
          description: The amount of the NFT transaction (in lamports).
        fee:
          type: integer
          example: 5000
        feePayer:
          type: string
          example: 8cRrU1NzNpjL3k2BwjW3VixAcX6VFc29KHr4KZg8cs2Y
        signature:
          type: string
          example: >-
            4jzQxVTaJ4Fe4Fct9y1aaT9hmVyEjpCqE2bL8JMnuLZbzHZwaL4kZZvNEZ6bEj6fGmiAdCPjmNQHCf8v994PAgDf
        slot:
          type: integer
          example: 148277128
        timestamp:
          type: integer
          example: 1656442333
        saleType:
          $ref: '#/components/schemas/SaleType'
        buyer:
          type: string
          description: The buyer of the NFT.
        seller:
          type: string
          description: The seller of the NFT.
        staker:
          type: string
          description: The staker of the NFT.
        nfts:
          type: array
          items:
            $ref: '#/components/schemas/Token'
          description: NFTs that are a part of this NFT event.
    SwapEvent:
      type: object
      properties:
        nativeInput:
          $ref: '#/components/schemas/NativeBalanceChange'
          description: The native input to the swap in Lamports.
        nativeOutput:
          $ref: '#/components/schemas/NativeBalanceChange'
          description: The native output of the swap in Lamports.
        tokenInputs:
          type: array
          items:
            $ref: '#/components/schemas/TokenBalanceChange'
          description: The token inputs to the swap.
        tokenOutputs:
          type: array
          items:
            $ref: '#/components/schemas/TokenBalanceChange'
          description: The token outputs of the swap.
        tokenFees:
          type: array
          items:
            $ref: '#/components/schemas/TokenBalanceChange'
          description: The token fees paid by an account.
        nativeFees:
          type: array
          items:
            $ref: '#/components/schemas/NativeBalanceChange'
          description: The native fees paid by an account.
        innerSwaps:
          type: array
          items:
            $ref: '#/components/schemas/TokenSwap'
          description: >-
            The inner swaps occurring to make this swap happen. Eg. a swap of
            wSOL <-> USDC may be make of multiple swaps from wSOL <-> DUST, DUST
            <-> USDC
    CompressedNFTEvent:
      type: object
      properties:
        type:
          $ref: '#/components/schemas/CompressedNFTEventType'
        treeId:
          type: string
          description: The address of the related merkle tree.
        assetId:
          type: string
          description: The id of the compressed nft.
        leafIndex:
          type: integer
          description: The index of the leaf being appended or modified.
        instructionIndex:
          type: integer
          description: The index of the parsed instruction in the transaction.
        innerInstructionIndex:
          type: integer
          description: The index of the parsed inner instruction in the transaction.
        newLeafOwner:
          type: string
          description: The new owner of the leaf.
        oldLeafOwner:
          type: string
          description: The previous owner of the leaf.
    DistributeCompressionRewardsEvent:
      type: object
      properties:
        amount:
          type: integer
          description: Amount transfered in the DistributeCompressionRewardsV0 instruction.
    SetAuthorityEvent:
      type: object
      properties:
        account:
          type: string
          description: Tthe account whose authority is changing.
        from:
          type: string
          description: Current authority.
        to:
          type: string
          description: New authority.
        instructionIndex:
          type: integer
          description: The index of the parsed instruction in the transaction.
        innerInstructionIndex:
          type: integer
          description: The index of the parsed inner instruction in the transaction.
    ErrorResponse:
      type: object
      description: JSON-RPC error response format
      properties:
        jsonrpc:
          type: string
          example: '2.0'
          description: JSON-RPC version
        error:
          type: object
          properties:
            code:
              type: integer
              description: Error code
              example: -32602
            message:
              type: string
              description: Error message
              example: Invalid params
        id:
          type: string
          description: Request identifier
          example: '1'
      required:
        - jsonrpc
        - error
        - id
    TokenBalanceChange:
      type: object
      properties:
        userAccount:
          type: string
          example: F54ZGuxyb2gA7vRjzWKLWEMQqCfJxDY1whtqtjdq4CJ
        tokenAccount:
          type: string
          example: 2kvmbRybhrcptDnwyNv6oiFGFEnRVv7MvVyqsxkirgdn
        mint:
          type: string
          example: DUSTawucrTsGU8hcqRdHDCbuYhCPADMLM2VcCb8VnFnQ
        rawTokenAmount:
          $ref: '#/components/schemas/RawTokenAmount'
    InnerInstruction:
      type: object
      description: Inner instructions for each instruction
      properties:
        accounts:
          type: array
          items:
            type: string
        data:
          type: string
        programId:
          type: string
    NFTEventType:
      type: string
      enum:
        - NFT_BID
        - NFT_BID_CANCELLED
        - NFT_GLOBAL_BID
        - NFT_GLOBAL_BID_CANCELLED
        - NFT_LISTING
        - NFT_CANCEL_LISTING
        - NFT_SALE
        - NFT_MINT
        - NFT_MINT_REJECTED
        - NFT_AUCTION_CREATED
        - NFT_AUCTION_UPDATED
        - NFT_AUCTION_CANCELLED
        - NFT_PARTICIPATION_REWARD
        - BURN_NFT
        - NFT_RENT_LISTING
        - NFT_RENT_CANCEL_LISTING
        - NFT_RENT_UPDATE_LISTING
        - NFT_RENT_ACTIVATE
        - NFT_RENT_END
        - ATTACH_METADATA
        - MIGRATE_TO_PNFT
        - CREATE_POOL
    SaleType:
      type: string
      enum:
        - AUCTION
        - INSTANT_SALE
        - OFFER
        - GLOBAL_OFFER
        - MINT
        - UNKNOWN
    Token:
      type: object
      properties:
        mint:
          type: string
          example: DsfCsbbPH77p6yeLS1i4ag9UA5gP9xWSvdCx72FJjLsx
          description: The mint account of the token.
        tokenStandard:
          $ref: '#/components/schemas/TokenStandard'
    NativeBalanceChange:
      type: object
      properties:
        account:
          type: string
          description: The account the native balance change is for
          example: 2uySTNgvGT2kwqpfgLiSgeBLR3wQyye1i1A2iQWoPiFr
        amount:
          type: string
          description: The amount of the balance change as a string
          example: '100000000'
    TokenSwap:
      type: object
      properties:
        tokenInputs:
          type: array
          items:
            $ref: '#/components/schemas/TokenTransfer'
          description: The token inputs of this swap.
        tokenOutputs:
          type: array
          items:
            $ref: '#/components/schemas/TokenTransfer'
          description: The token outputs of this swap.
        tokenFees:
          type: array
          items:
            $ref: '#/components/schemas/TokenTransfer'
          description: Fees charged with tokens for this swap.
        nativeFees:
          type: array
          items:
            $ref: '#/components/schemas/NativeTransfer'
          description: Fees charged in SOL for this swap.
        programInfo:
          $ref: '#/components/schemas/ProgramInfo'
          description: Information about the program creating this swap.
    CompressedNFTEventType:
      type: string
      enum:
        - CREATE_MERKLE_TREE
        - COMPRESSED_NFT_MINT
        - COMPRESSED_NFT_TRANSFER
        - COMPRESSED_NFT_REDEEM
        - COMPRESSED_NFT_CANCEL_REDEEM
        - COMPRESSED_NFT_BURN
        - COMPRESSED_NFT_DELEGATE
    RawTokenAmount:
      type: object
      properties:
        tokenAmount:
          type: string
        decimals:
          type: integer
    TokenStandard:
      type: string
      enum:
        - NonFungible
        - FungibleAsset
        - Fungible
        - NonFungibleEdition
    ProgramInfo:
      type: object
      properties:
        source:
          type: string
          example: ORCA
        account:
          type: string
          description: The account of the program
          example: whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc
        programName:
          type: string
          description: The name of the program
          example: ORCA_WHIRLPOOLS
        instructionName:
          type: string
          description: >-
            The name of the instruction creating this swap. It is the value of
            instruction name from the Anchor IDL, if it is available.
          example: whirlpoolSwap
  responses:
    400-BadRequest:
      description: Invalid request.
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponse'
          example:
            jsonrpc: '2.0'
            error:
              code: -32602
              message: Invalid params
            id: '1'
    401-Unauthorized:
      description: Unauthorized request.
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponse'
          example:
            jsonrpc: '2.0'
            error:
              code: -32001
              message: Unauthorized
            id: '1'
    403-Forbidden:
      description: Request was forbidden.
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponse'
          example:
            jsonrpc: '2.0'
            error:
              code: -32003
              message: Forbidden
            id: '1'
    404-NotFound:
      description: The specified resource was not found.
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponse'
          example:
            jsonrpc: '2.0'
            error:
              code: -32601
              message: Method not found
            id: '1'
    429-TooManyRequests:
      description: Exceeded rate limit.
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponse'
          example:
            jsonrpc: '2.0'
            error:
              code: -32005
              message: Rate limit exceeded
            id: '1'
    500-InternalServerError:
      description: >-
        The server encountered an unexpected condition that prevented it from
        fulfilling the request.
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponse'
          example:
            jsonrpc: '2.0'
            error:
              code: -32603
              message: Internal error
            id: '1'
    503-ServiceUnavailable:
      description: The service is temporarily unavailable.
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponse'
          example:
            jsonrpc: '2.0'
            error:
              code: -32002
              message: Service unavailable
            id: '1'
    504-GatewayTimeout:
      description: The request timed out.
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponse'
          example:
            jsonrpc: '2.0'
            error:
              code: -32003
              message: Gateway timeout
            id: '1'
  securitySchemes:
    ApiKeyQuery:
      type: apiKey
      in: query
      name: api-key
      description: >-
        Your Helius API key. You can get one for free in the
        [dashboard](https://dashboard.helius.dev/api-keys).

````
> ## Documentation Index
> Fetch the complete documentation index at: https://www.helius.dev/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# getLargestAccounts

> Returns the 20 largest accounts, by lamport balance (results may be cached up to two hours).

## Request Parameters

<ParamField body="commitment" type="string">
  The commitment level for the request.

  * `confirmed`
  * `finalized`
</ParamField>

<ParamField body="filter" type="string">
  Filter results by account type - either all circulating SOL accounts or only special non-circulating reserve accounts.

  * `circulating`
  * `nonCirculating`
</ParamField>


## OpenAPI

````yaml openapi/rpc-http/getLargestAccounts.yaml post /
openapi: 3.1.0
info:
  title: Solana RPC API
  version: 1.0.0
  description: >-
    Wealth distribution analytics API for identifying and monitoring the largest
    SOL holders on the Solana blockchain with filtering options for circulating
    and reserve accounts.
  license:
    name: Apache 2.0
    url: https://www.apache.org/licenses/LICENSE-2.0.html
servers:
  - url: https://mainnet.helius-rpc.com
    description: Mainnet RPC endpoint
  - url: https://devnet.helius-rpc.com
    description: Devnet RPC endpoint
security: []
paths:
  /:
    post:
      tags:
        - RPC
      summary: getLargestAccounts
      description: >
        Retrieve a ranked list of the largest SOL holders on the Solana
        blockchain.

        This wealth analytics API provides insights into SOL distribution by
        identifying the

        accounts holding the most significant native token balances. Returns the
        top 20 accounts

        ranked by SOL balance, with options to filter between circulating supply
        (active accounts)

        and non-circulating supply (reserve accounts). Essential for market
        researchers, economic

        analysts, whale watchers, wealth concentration studies, and applications
        monitoring major

        SOL holders and their potential impact on token economics and market
        movements.
      operationId: getLargestAccounts
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - jsonrpc
                - id
                - method
              properties:
                jsonrpc:
                  type: string
                  description: The JSON-RPC protocol version.
                  enum:
                    - '2.0'
                  example: '2.0'
                  default: '2.0'
                id:
                  type: string
                  description: A unique identifier for the request.
                  example: '1'
                  default: '1'
                method:
                  type: string
                  description: The name of the RPC method to invoke.
                  enum:
                    - getLargestAccounts
                  example: getLargestAccounts
                  default: getLargestAccounts
                params:
                  type: array
                  description: Optional configuration object for filtering accounts.
                  default: []
                  items:
                    type: object
                    properties:
                      commitment:
                        type: string
                        description: The commitment level for the request.
                        enum:
                          - confirmed
                          - finalized
                        example: finalized
                      filter:
                        type: string
                        description: >-
                          Filter results by account type - either all
                          circulating SOL accounts or only special
                          non-circulating reserve accounts.
                        enum:
                          - circulating
                          - nonCirculating
                        example: circulating
      responses:
        '200':
          description: Successfully retrieved the largest accounts.
          content:
            application/json:
              schema:
                type: object
                properties:
                  jsonrpc:
                    type: string
                    description: The JSON-RPC protocol version.
                    enum:
                      - '2.0'
                    example: '2.0'
                  id:
                    type: string
                    description: Identifier matching the request.
                    example: '1'
                  result:
                    type: object
                    description: List of the largest accounts and their balances.
                    properties:
                      context:
                        type: object
                        description: Context of the response.
                        properties:
                          slot:
                            type: integer
                            description: The slot at which the data was fetched.
                            example: 54
                      value:
                        type: array
                        description: >-
                          Top 20 largest Solana accounts ranked by SOL balance,
                          from highest to lowest.
                        items:
                          type: object
                          properties:
                            lamports:
                              type: integer
                              description: >-
                                SOL balance of this account in lamports (1 SOL =
                                1,000,000,000 lamports).
                              example: 999974
                            address:
                              type: string
                              description: >-
                                Unique Solana wallet address of this major
                                account holder.
                              example: 99P8ZgtJYe1buSK8JXkvpLh8xPsCFuLYhz9hQFNw93WJ
        '400':
          description: Bad Request - Invalid request parameters or malformed request.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                jsonrpc: '2.0'
                error:
                  code: -32602
                  message: Invalid params
                id: '1'
        '401':
          description: Unauthorized - Invalid or missing API key.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                jsonrpc: '2.0'
                error:
                  code: -32001
                  message: Unauthorized
                id: '1'
        '429':
          description: Too Many Requests - Rate limit exceeded.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                jsonrpc: '2.0'
                error:
                  code: -32005
                  message: Too many requests
                id: '1'
        '500':
          description: Internal Server Error - An error occurred on the server.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                jsonrpc: '2.0'
                error:
                  code: -32603
                  message: Internal error
                id: '1'
        '503':
          description: Service Unavailable - The service is temporarily unavailable.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                jsonrpc: '2.0'
                error:
                  code: -32002
                  message: Service unavailable
                id: '1'
        '504':
          description: Gateway Timeout - The request timed out.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                jsonrpc: '2.0'
                error:
                  code: -32003
                  message: Gateway timeout
                id: '1'
      security:
        - ApiKeyQuery: []
components:
  schemas:
    ErrorResponse:
      type: object
      properties:
        jsonrpc:
          type: string
          description: The JSON-RPC protocol version.
          enum:
            - '2.0'
          example: '2.0'
        error:
          type: object
          properties:
            code:
              type: integer
              description: The error code.
              example: -32602
            message:
              type: string
              description: The error message.
            data:
              type: object
              description: Additional data about the error.
        id:
          type: string
          description: Identifier matching the request.
          example: '1'
  securitySchemes:
    ApiKeyQuery:
      type: apiKey
      in: query
      name: api-key
      description: >-
        Your Helius API key. You can get one for free in the
        [dashboard](https://dashboard.helius.dev/api-keys).

````
> ## Documentation Index
> Fetch the complete documentation index at: https://www.helius.dev/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# getProgramAccountsV2

> Enhanced version of getProgramAccounts with cursor-based pagination and changedSinceSlot support for efficiently querying large sets of accounts owned by specific Solana programs with incremental updates.

## Overview

`getProgramAccountsV2` is an enhanced version of the standard `getProgramAccounts` method, designed for applications that need to efficiently query large sets of accounts owned by specific Solana programs. This method introduces cursor-based pagination and incremental update capabilities.

<Info>
  **New Features in V2:**

  * **Cursor-based pagination**: Configure limits from 1 to 10,000 accounts per request
  * **Incremental updates**: Use `changedSinceSlot` to fetch only recently modified accounts
  * **Better performance**: Prevents timeouts and reduces memory usage for large datasets
  * **Backward compatibility**: Supports all existing `getProgramAccounts` parameters
</Info>

## Key Benefits

<CardGroup cols={2}>
  <Card title="Scalable Queries" icon="chart-line">
    Handle programs with millions of accounts by paginating through results efficiently
  </Card>

  <Card title="Real-time Sync" icon="arrows-rotate">
    Use `changedSinceSlot` for incremental updates and real-time data synchronization
  </Card>

  <Card title="Prevent Timeouts" icon="clock">
    Large queries that previously timed out now work reliably with pagination
  </Card>

  <Card title="Memory Efficient" icon="microchip">
    Process data in chunks instead of loading everything into memory at once
  </Card>
</CardGroup>

## Pagination Best Practices

<Warning>
  **Important Pagination Behavior**: End of pagination is only indicated when **no accounts are returned**. The API may return fewer accounts than your limit due to filtering - always continue pagination until `paginationKey` is `null`.
</Warning>

### Basic Pagination Pattern

```typescript  theme={"system"}
let allAccounts = [];
let paginationKey = null;

do {
  const response = await fetch(`https://mainnet.helius-rpc.com/?api-key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: '1',
      method: 'getProgramAccountsV2',
      params: [
        "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
        {
          encoding: 'base64',
          filters: [{ dataSize: 165 }],
          limit: 5000,
          ...(paginationKey && { paginationKey })
        }
      ]
    })
  });
  
  const data = await response.json();
  allAccounts.push(...data.result.accounts);
  paginationKey = data.result.paginationKey;
} while (paginationKey);
```

### Incremental Updates

```typescript  theme={"system"}
// Get only accounts modified since slot 150000000
const incrementalUpdate = await fetch(`https://mainnet.helius-rpc.com/?api-key=${API_KEY}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    jsonrpc: '2.0',
    id: '1',
    method: 'getProgramAccountsV2',
    params: [
      programId,
      {
        encoding: 'jsonParsed',
        limit: 1000,
        changedSinceSlot: 150000000
      }
    ]
  })
});
```

## Performance Tips

<Tip>
  **Optimal Limit Size**: For most use cases, a limit of 1,000-5,000 accounts per request provides the best balance of performance and reliability.
</Tip>

* **Start with smaller limits** (1000) and increase based on your network performance
* **Use appropriate encoding**: `jsonParsed` for convenience, `base64` for performance
* **Apply filters** to reduce the dataset size before pagination
* **Store `paginationKey`** to resume queries if interrupted
* **Monitor response times** and adjust limits accordingly

## Migration from getProgramAccounts

Migrating from the original method is straightforward - simply replace the method name and add pagination parameters:

```diff  theme={"system"}
{
  "jsonrpc": "2.0",
  "id": "1",
- "method": "getProgramAccounts",
+ "method": "getProgramAccountsV2",
  "params": [
    "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
    {
      "encoding": "base64",
      "filters": [{ "dataSize": 165 }],
+     "limit": 5000
    }
  ]
}
```

## Related Methods

<CardGroup cols={2}>
  <Card title="getProgramAccounts" icon="code" href="/api-reference/rpc/http/getprogramaccounts">
    Original method without pagination
  </Card>

  <Card title="getTokenAccountsByOwnerV2" icon="wallet" href="/api-reference/rpc/http/gettokenaccountsbyownerv2">
    V2 method for token account queries
  </Card>
</CardGroup>

## Request Parameters

<ParamField body="address" type="string" required>
  The Solana program public key (address) to query accounts for, as a base-58 encoded string.
</ParamField>

<ParamField body="commitment" type="string">
  The commitment level for the request.

  * `confirmed`
  * `finalized`
  * `processed`
</ParamField>

<ParamField body="minContextSlot" type="number">
  The minimum slot that the request can be evaluated at.
</ParamField>

<ParamField body="withContext" type="boolean">
  Wrap the result in an RpcResponse JSON object.
</ParamField>

<ParamField body="encoding" type="string">
  Encoding format for the returned account data.

  * `jsonParsed`
  * `base58`
  * `base64`
  * `base64+zstd`
</ParamField>

<ParamField body="dataSlice" type="object">
  Request a slice of the account's data.
</ParamField>

<ParamField body="dataSlice.length" type="number">
  Number of bytes to return.
</ParamField>

<ParamField body="dataSlice.offset" type="number">
  Byte offset from which to start reading.
</ParamField>

<ParamField body="limit" type="number">
  Maximum number of accounts to return per request (1-10,000).
</ParamField>

<ParamField body="paginationKey" type="string">
  Base-58 encoded pagination cursor for fetching subsequent pages. Use the paginationKey from previous response.
</ParamField>

<ParamField body="changedSinceSlot" type="number">
  Only return accounts that were modified at or after this slot number. Useful for incremental updates.
</ParamField>

<ParamField body="filters" type="array">
  Powerful filtering system to efficiently query specific Solana account data patterns.
</ParamField>


## OpenAPI

````yaml openapi/rpc-http/getProgramAccountsV2.yaml post /
openapi: 3.1.0
info:
  title: Solana RPC API
  version: 1.0.0
  description: >-
    Enhanced Solana program account indexing API with cursor-based pagination
    and changedSinceSlot support for efficiently querying large sets of accounts
    owned by specific programs. Supports incremental updates via slot-based
    filtering for real-time data synchronization.
  license:
    name: Apache 2.0
    url: https://www.apache.org/licenses/LICENSE-2.0.html
servers:
  - url: https://mainnet.helius-rpc.com
    description: Mainnet RPC endpoint
  - url: https://devnet.helius-rpc.com
    description: Devnet RPC endpoint
security: []
paths:
  /:
    post:
      tags:
        - RPC
      summary: getProgramAccountsV2
      description: >
        Enhanced version of getProgramAccounts with cursor-based pagination and
        changedSinceSlot support for efficiently querying 

        large sets of accounts owned by specific Solana programs. Enables
        incremental data fetching with 

        configurable page sizes up to 10,000 accounts per request. The
        changedSinceSlot parameter allows retrieving 

        only accounts modified since a specific blockchain slot, perfect for
        real-time indexing and data 

        synchronization workflows. Essential for applications dealing with
        large-scale program account discovery 

        such as DeFi protocols, NFT marketplaces, and blockchain analytics
        platforms.


        Note: End of pagination is only indicated when no accounts are returned.
        The API may return fewer accounts 

        than the limit due to filtering - continue pagination until
        paginationKey is null.
      operationId: getProgramAccountsV2
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - jsonrpc
                - id
                - method
                - params
              properties:
                jsonrpc:
                  type: string
                  description: The JSON-RPC protocol version.
                  enum:
                    - '2.0'
                  example: '2.0'
                  default: '2.0'
                id:
                  type: string
                  description: A unique identifier for the request.
                  example: '1'
                  default: '1'
                method:
                  type: string
                  description: The name of the RPC method to invoke.
                  enum:
                    - getProgramAccountsV2
                  example: getProgramAccountsV2
                  default: getProgramAccountsV2
                params:
                  type: array
                  description: Parameters for the enhanced paginated method.
                  default:
                    - TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA
                    - encoding: base64
                      limit: 1000
                  items:
                    oneOf:
                      - type: string
                        description: >-
                          The Solana program public key (address) to query
                          accounts for, as a base-58 encoded string.
                        example: TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA
                      - type: object
                        description: >-
                          Enhanced configuration options with pagination support
                          for optimizing program account queries.
                        properties:
                          commitment:
                            type: string
                            description: The commitment level for the request.
                            enum:
                              - confirmed
                              - finalized
                              - processed
                            example: finalized
                          minContextSlot:
                            type: integer
                            description: >-
                              The minimum slot that the request can be evaluated
                              at.
                            example: 1000
                          withContext:
                            type: boolean
                            description: Wrap the result in an RpcResponse JSON object.
                            example: true
                          encoding:
                            type: string
                            description: Encoding format for the returned account data.
                            enum:
                              - jsonParsed
                              - base58
                              - base64
                              - base64+zstd
                            example: base64
                          dataSlice:
                            type: object
                            description: Request a slice of the account's data.
                            properties:
                              length:
                                type: integer
                                description: Number of bytes to return.
                                example: 50
                              offset:
                                type: integer
                                description: Byte offset from which to start reading.
                                example: 0
                          limit:
                            type: integer
                            description: >-
                              Maximum number of accounts to return per request
                              (1-10,000).
                            minimum: 1
                            maximum: 10000
                            example: 1000
                          paginationKey:
                            type: string
                            description: >-
                              Base-58 encoded pagination cursor for fetching
                              subsequent pages. Use the paginationKey from
                              previous response.
                            example: 9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM
                          changedSinceSlot:
                            type: integer
                            description: >-
                              Only return accounts that were modified at or
                              after this slot number. Useful for incremental
                              updates.
                            example: 12345678
                          filters:
                            type: array
                            description: >-
                              Powerful filtering system to efficiently query
                              specific Solana account data patterns.
                            items:
                              oneOf:
                                - type: object
                                  description: >-
                                    Filter Solana accounts by their exact data
                                    size in bytes.
                                  properties:
                                    dataSize:
                                      type: integer
                                      description: >-
                                        The exact size of the account data in
                                        bytes for filtering.
                                      example: 165
                                - type: object
                                  description: >-
                                    Filter Solana accounts by comparing data at
                                    specific memory offsets (most powerful
                                    filter).
                                  properties:
                                    memcmp:
                                      type: object
                                      description: >-
                                        Memory comparison filter for finding
                                        accounts with specific data patterns.
                                      properties:
                                        offset:
                                          type: integer
                                          description: >-
                                            Byte offset within account data to
                                            perform the comparison.
                                          example: 4
                                        bytes:
                                          type: string
                                          description: >-
                                            Base-58 encoded data to compare at the
                                            specified offset position.
                                          example: 3Mc6vR
      responses:
        '200':
          description: Successfully retrieved paginated program accounts.
          content:
            application/json:
              schema:
                type: object
                properties:
                  jsonrpc:
                    type: string
                    description: The JSON-RPC protocol version.
                    enum:
                      - '2.0'
                    example: '2.0'
                  id:
                    type: string
                    description: Identifier matching the request.
                    example: '1'
                  result:
                    type: object
                    description: Paginated program accounts with navigation metadata.
                    properties:
                      accounts:
                        type: array
                        description: List of program accounts for the current page.
                        items:
                          type: object
                          properties:
                            pubkey:
                              type: string
                              description: The account Pubkey as a base-58 encoded string.
                              example: CxELquR1gPP8wHe33gZ4QxqGB3sZ9RSwsJ2KshVewkFY
                            account:
                              type: object
                              description: Details about the account.
                              properties:
                                lamports:
                                  type: integer
                                  description: Number of lamports assigned to this account.
                                  example: 15298080
                                owner:
                                  type: string
                                  description: >-
                                    Base-58 encoded Pubkey of the program this
                                    account is assigned to.
                                  example: TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA
                                data:
                                  type: array
                                  description: >-
                                    Account data as encoded binary or JSON
                                    format.
                                  items:
                                    type: string
                                  example:
                                    - 2R9jLfiAQ9bgdcw6h8s44439
                                    - base64
                                executable:
                                  type: boolean
                                  description: Indicates if the account contains a program.
                                  example: false
                                rentEpoch:
                                  type: integer
                                  description: >-
                                    The epoch at which this account will next
                                    owe rent.
                                  example: 28
                                space:
                                  type: integer
                                  description: The data size of the account.
                                  example: 165
                      paginationKey:
                        type: string
                        description: >-
                          Pagination cursor for the next page. Null only when no
                          accounts are returned (end of pagination). Note that
                          fewer accounts than the limit may be returned due to
                          filtering, but this does not indicate end of
                          pagination.
                        example: 8WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM
                        nullable: true
                      totalResults:
                        type: integer
                        description: >-
                          Total number of accounts matching the query (if
                          available).
                        example: 25000
                        nullable: true
        '400':
          description: Bad Request - Invalid request parameters or malformed request.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                jsonrpc: '2.0'
                error:
                  code: -32602
                  message: Invalid params
                  data: {}
                id: '1'
        '401':
          description: Unauthorized - Invalid or missing API key.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                jsonrpc: '2.0'
                error:
                  code: -32001
                  message: Unauthorized
                  data: {}
                id: '1'
        '429':
          description: Too Many Requests - Rate limit exceeded.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                jsonrpc: '2.0'
                error:
                  code: -32005
                  message: Too many requests
                  data: {}
                id: '1'
        '500':
          description: Internal Server Error - An error occurred on the server.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                jsonrpc: '2.0'
                error:
                  code: -32603
                  message: Internal error
                  data: {}
                id: '1'
        '503':
          description: Service Unavailable - The service is temporarily unavailable.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                jsonrpc: '2.0'
                error:
                  code: -32002
                  message: Service unavailable
                  data: {}
                id: '1'
        '504':
          description: Gateway Timeout - The request timed out.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                jsonrpc: '2.0'
                error:
                  code: -32003
                  message: Gateway timeout
                  data: {}
                id: '1'
      security:
        - ApiKeyQuery: []
components:
  schemas:
    ErrorResponse:
      type: object
      properties:
        jsonrpc:
          type: string
          description: The JSON-RPC protocol version.
          enum:
            - '2.0'
          example: '2.0'
        error:
          type: object
          properties:
            code:
              type: integer
              description: The error code.
              example: -32602
            message:
              type: string
              description: The error message.
            data:
              type: object
              description: Additional data about the error.
        id:
          type: string
          description: Identifier matching the request.
          example: '1'
  securitySchemes:
    ApiKeyQuery:
      type: apiKey
      in: query
      name: api-key
      description: >-
        Your Helius API key. You can get one for free in the
        [dashboard](https://dashboard.helius.dev/api-keys).

````
> ## Documentation Index
> Fetch the complete documentation index at: https://www.helius.dev/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# getTransactionsForAddress

> Enhanced transaction history API with powerful filtering, sorting, and pagination capabilities for retrieving comprehensive transaction data for any address. Supports bidirectional sorting, time/slot/status filtering, and efficient keyset pagination.

## Request Parameters

<ParamField body="address" type="string" required>
  Solana account address to retrieve transaction history for (wallet, token, program, NFT, etc.).
</ParamField>

<ParamField body="transactionDetails" type="string" default="signatures">
  Level of transaction detail to return.

  * `signatures`
  * `full`
</ParamField>

<ParamField body="sortOrder" type="string" default="desc">
  Sort order for returned transactions.

  * `asc`
  * `desc`
</ParamField>

<ParamField body="commitment" type="string" default="finalized">
  The commitment level for the request. The `processed` commitment is not supported.

  * `confirmed`
  * `finalized`
</ParamField>

<ParamField body="minContextSlot" type="number">
  Minimum context slot to use for request (optional).
</ParamField>

<ParamField body="limit" type="number" default="1000">
  Maximum number of transactions per request. Use 1–1000 for transactionDetails:"signatures" and 1–100 for transactionDetails:"full".
</ParamField>

<ParamField body="paginationToken" type="string">
  Pagination token from previous response to get next page of results (format "slot:position").
</ParamField>

<ParamField body="encoding" type="string" default="json">
  Encoding format for transaction data (applies only when transactionDetails=full).

  * `json`
  * `jsonParsed`
  * `base58`
  * `base64`
</ParamField>

<ParamField body="maxSupportedTransactionVersion" type="number">
  Maximum transaction version to return (applies only when transactionDetails=full).
</ParamField>

<ParamField body="filters" type="object">
  Advanced filters to narrow down transaction results.
</ParamField>

<ParamField body="filters.slot" type="object">
  Filter by slot number.
</ParamField>

<ParamField body="filters.slot.gte" type="number">
  Greater than or equal to slot number.
</ParamField>

<ParamField body="filters.slot.gt" type="number">
  Greater than slot number.
</ParamField>

<ParamField body="filters.slot.lte" type="number">
  Less than or equal to slot number.
</ParamField>

<ParamField body="filters.slot.lt" type="number">
  Less than slot number.
</ParamField>

<ParamField body="filters.blockTime" type="object">
  Filter by block timestamp (Unix timestamp).
</ParamField>

<ParamField body="filters.blockTime.gte" type="number">
  Greater than or equal to timestamp.
</ParamField>

<ParamField body="filters.blockTime.gt" type="number">
  Greater than timestamp.
</ParamField>

<ParamField body="filters.blockTime.lte" type="number">
  Less than or equal to timestamp.
</ParamField>

<ParamField body="filters.blockTime.lt" type="number">
  Less than timestamp.
</ParamField>

<ParamField body="filters.blockTime.eq" type="number">
  Equal to timestamp.
</ParamField>

<ParamField body="filters.signature" type="object">
  Filter by transaction signature.
</ParamField>

<ParamField body="filters.signature.gte" type="string">
  Get transactions with signatures greater than or equal to this value.
</ParamField>

<ParamField body="filters.signature.gt" type="string">
  Get transactions after this signature.
</ParamField>

<ParamField body="filters.signature.lte" type="string">
  Get transactions with signatures less than or equal to this value.
</ParamField>

<ParamField body="filters.signature.lt" type="string">
  Get transactions before this signature.
</ParamField>

<ParamField body="filters.status" type="string" default="any">
  Filter by transaction status.

  * `succeeded`
  * `failed`
  * `any`
</ParamField>

<ParamField body="filters.tokenAccounts" type="string" default="none">
  Filter transactions for related token accounts. Controls whether to include transactions involving token accounts owned by the address.

  * `none`
  * `balanceChanged`
  * `all`
</ParamField>


## OpenAPI

````yaml openapi/rpc-http/getTransactionsForAddress.yaml post /
openapi: 3.1.0
info:
  title: Solana RPC API
  version: 1.0.0
  description: >-
    Advanced Solana transaction history API with powerful filtering, sorting,
    and pagination capabilities for retrieving comprehensive transaction data
    for any address.
  license:
    name: Apache 2.0
    url: https://www.apache.org/licenses/LICENSE-2.0.html
servers:
  - url: https://mainnet.helius-rpc.com
    description: Mainnet RPC endpoint
  - url: https://devnet.helius-rpc.com
    description: Devnet RPC endpoint
security: []
paths:
  /:
    post:
      tags:
        - RPC
      summary: getTransactionsForAddress
      description: >
        Enhanced transaction history API that provides powerful filtering,
        sorting, and pagination capabilities 

        for retrieving transaction data associated with any Solana address. This
        advanced method overcomes the 

        limitations of getSignaturesForAddress by offering:


        - Bidirectional sorting (ascending/descending chronological order)

        - Advanced filtering by slot, time, signature, and transaction status

        - Token account support (include transactions for associated token
        accounts)

        - Efficient keyset pagination using slot-based keys

        - Option to return full transaction details or just signatures

        - Support for time range queries and status filtering


        Perfect for building comprehensive wallet histories, analytics
        dashboards, audit trails, 

        and any application requiring detailed transaction analysis with precise
        control over data retrieval.
      operationId: getTransactionsForAddress
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - jsonrpc
                - id
                - method
                - params
              properties:
                jsonrpc:
                  type: string
                  enum:
                    - '2.0'
                  example: '2.0'
                  description: The JSON-RPC protocol version.
                  default: '2.0'
                id:
                  type: string
                  example: '1'
                  description: A unique identifier for the request.
                  default: '1'
                method:
                  type: string
                  enum:
                    - getTransactionsForAddress
                  example: getTransactionsForAddress
                  description: The name of the RPC method to invoke.
                  default: getTransactionsForAddress
                params:
                  type: array
                  description: >-
                    Array containing the required account address and optional
                    configuration object.
                  minItems: 1
                  maxItems: 2
                  prefixItems:
                    - type: string
                      description: >-
                        Solana account address to retrieve transaction history
                        for (wallet, token, program, NFT, etc.).
                      example: Vote111111111111111111111111111111111111111
                    - type: object
                      description: >-
                        Advanced query configuration for filtering, sorting, and
                        pagination.
                      properties:
                        transactionDetails:
                          type: string
                          description: Level of transaction detail to return.
                          enum:
                            - signatures
                            - full
                          default: signatures
                          example: signatures
                        sortOrder:
                          type: string
                          description: Sort order for returned transactions.
                          enum:
                            - asc
                            - desc
                          default: desc
                          example: desc
                        commitment:
                          type: string
                          description: >-
                            The commitment level for the request. The
                            `processed` commitment is not supported.
                          enum:
                            - confirmed
                            - finalized
                          default: finalized
                          example: finalized
                        minContextSlot:
                          type: integer
                          description: Minimum context slot to use for request (optional).
                          example: 1000
                        limit:
                          type: integer
                          description: >-
                            Maximum number of transactions per request. Use
                            1–1000 for transactionDetails:"signatures" and 1–100
                            for transactionDetails:"full".
                          minimum: 1
                          maximum: 1000
                          default: 1000
                          example: 100
                        paginationToken:
                          type: string
                          description: >-
                            Pagination token from previous response to get next
                            page of results (format "slot:position").
                          example: '1053:13'
                        encoding:
                          type: string
                          description: >-
                            Encoding format for transaction data (applies only
                            when transactionDetails=full).
                          enum:
                            - json
                            - jsonParsed
                            - base58
                            - base64
                          default: json
                          example: json
                        maxSupportedTransactionVersion:
                          type: integer
                          description: >-
                            Maximum transaction version to return (applies only
                            when transactionDetails=full).
                          example: 0
                        filters:
                          type: object
                          description: Advanced filters to narrow down transaction results.
                          properties:
                            slot:
                              type: object
                              description: Filter by slot number.
                              properties:
                                gte:
                                  type: integer
                                  description: Greater than or equal to slot number.
                                  example: 100
                                gt:
                                  type: integer
                                  description: Greater than slot number.
                                  example: 100
                                lte:
                                  type: integer
                                  description: Less than or equal to slot number.
                                  example: 200
                                lt:
                                  type: integer
                                  description: Less than slot number.
                                  example: 200
                              additionalProperties: false
                            blockTime:
                              type: object
                              description: Filter by block timestamp (Unix timestamp).
                              properties:
                                gte:
                                  type: integer
                                  description: Greater than or equal to timestamp.
                                  example: 1640995200
                                gt:
                                  type: integer
                                  description: Greater than timestamp.
                                  example: 1640995200
                                lte:
                                  type: integer
                                  description: Less than or equal to timestamp.
                                  example: 1641081600
                                lt:
                                  type: integer
                                  description: Less than timestamp.
                                  example: 1641081600
                                eq:
                                  type: integer
                                  description: Equal to timestamp.
                                  example: 1641038400
                              additionalProperties: false
                            signature:
                              type: object
                              description: Filter by transaction signature.
                              properties:
                                gte:
                                  type: string
                                  description: >-
                                    Get transactions with signatures greater
                                    than or equal to this value.
                                  example: >-
                                    4h6xBEauJ3PK6SWCZ1PGjBvj8vDdWG3KpwATGy1ARAXFSDwt8GFXM7W5Ncn16wmqokgpiKRLuS83KUxyZyv2sUYv
                                gt:
                                  type: string
                                  description: Get transactions after this signature.
                                  example: >-
                                    3jweEauJ3PK6SWCZ1PGjBvj8vDdWG3KpwATGy1ARAXFSDwt8GFXM7W5Ncn16wmqokgpiKRLuS83KUxyZyv2sUYv
                                lte:
                                  type: string
                                  description: >-
                                    Get transactions with signatures less than
                                    or equal to this value.
                                  example: >-
                                    6k7xBEauJ3PK6SWCZ1PGjBvj8vDdWG3KpwATGy1ARAXFSDwt8GFXM7W5Ncn16wmqokgpiKRLuS83KUxyZyv2sUYv
                                lt:
                                  type: string
                                  description: Get transactions before this signature.
                                  example: >-
                                    5h6xBEauJ3PK6SWCZ1PGjBvj8vDdWG3KpwATGy1ARAXFSDwt8GFXM7W5Ncn16wmqokgpiKRLuS83KUxyZyv2sUYv
                              additionalProperties: false
                            status:
                              type: string
                              description: Filter by transaction status.
                              enum:
                                - succeeded
                                - failed
                                - any
                              default: any
                              example: succeeded
                            tokenAccounts:
                              type: string
                              description: >-
                                Filter transactions for related token accounts.
                                Controls whether to include transactions
                                involving token accounts owned by the address.
                              enum:
                                - none
                                - balanceChanged
                                - all
                              default: none
                              example: balanceChanged
                          additionalProperties: false
                  items: false
                  default:
                    - Vote111111111111111111111111111111111111111
                    - transactionDetails: signatures
                      limit: 50
                      sortOrder: desc
                      filters:
                        status: succeeded
                        slot:
                          gte: 1000
                          lt: 2000
                  example:
                    - Vote111111111111111111111111111111111111111
                    - transactionDetails: signatures
                      limit: 50
                      sortOrder: desc
                      filters:
                        status: succeeded
                        slot:
                          gte: 1000
                          lt: 2000
            example:
              jsonrpc: '2.0'
              id: '1'
              method: getTransactionsForAddress
              params:
                - Vote111111111111111111111111111111111111111
                - transactionDetails: signatures
                  limit: 10
      responses:
        '200':
          description: Successfully retrieved transactions for the specified address.
          content:
            application/json:
              schema:
                type: object
                properties:
                  jsonrpc:
                    type: string
                    description: The JSON-RPC protocol version.
                    enum:
                      - '2.0'
                    example: '2.0'
                  id:
                    type: string
                    description: Identifier matching the request.
                    example: '1'
                  result:
                    type: object
                    description: Transaction data and pagination information.
                    properties:
                      data:
                        type: array
                        description: List of transaction information.
                        items:
                          oneOf:
                            - type: object
                              description: >-
                                Signature-level transaction summary (when
                                transactionDetails is "signatures").
                              properties:
                                signature:
                                  type: string
                                  description: >-
                                    Transaction signature as a base-58 encoded
                                    string.
                                  example: >-
                                    5h6xBEauJ3PK6SWCZ1PGjBvj8vDdWG3KpwATGy1ARAXFSDwt8GFXM7W5Ncn16wmqokgpiKRLuS83KUxyZyv2sUYv
                                slot:
                                  type: integer
                                  description: >-
                                    The slot that contains the block with the
                                    transaction.
                                  example: 1054
                                transactionIndex:
                                  type: integer
                                  description: >-
                                    The zero-based index of the transaction
                                    within its block. Useful for determining
                                    transaction ordering within a block.
                                  example: 42
                                err:
                                  oneOf:
                                    - type: object
                                      description: Error if the transaction failed
                                    - type: 'null'
                                  description: >-
                                    Error if the transaction failed, or null if
                                    successful.
                                  example: null
                                memo:
                                  oneOf:
                                    - type: string
                                      description: Memo associated with the transaction
                                    - type: 'null'
                                  description: >-
                                    Memo associated with the transaction, or
                                    null if none.
                                  example: null
                                blockTime:
                                  oneOf:
                                    - type: integer
                                      description: >-
                                        Estimated production time as Unix
                                        timestamp
                                    - type: 'null'
                                  description: >-
                                    Estimated production time as Unix timestamp
                                    (seconds since epoch), or null if not
                                    available.
                                  example: 1641038400
                                confirmationStatus:
                                  oneOf:
                                    - type: string
                                      enum:
                                        - processed
                                        - confirmed
                                        - finalized
                                      description: >-
                                        Transaction's cluster confirmation
                                        status
                                    - type: 'null'
                                  description: Transaction's cluster confirmation status.
                                  example: finalized
                              required:
                                - signature
                                - slot
                              additionalProperties: false
                            - type: object
                              description: >-
                                Full transaction with status metadata (when
                                transactionDetails is "full").
                              properties:
                                slot:
                                  type: integer
                                  description: >-
                                    The slot that contains the block with the
                                    transaction.
                                  example: 1054
                                transactionIndex:
                                  type: integer
                                  description: >-
                                    The zero-based index of the transaction
                                    within its block. Useful for determining
                                    transaction ordering within a block.
                                  example: 42
                                transaction:
                                  type: object
                                  description: >-
                                    Encoded or parsed transaction object per the
                                    selected encoding.
                                meta:
                                  type: object
                                  description: Transaction status metadata.
                                blockTime:
                                  oneOf:
                                    - type: integer
                                      description: >-
                                        Estimated production time as Unix
                                        timestamp
                                    - type: 'null'
                                  description: >-
                                    Estimated production time as Unix timestamp
                                    (seconds since epoch), or null if not
                                    available.
                              required:
                                - slot
                                - transaction
                      paginationToken:
                        oneOf:
                          - type: string
                            description: Token for retrieving the next page of results
                          - type: 'null'
                        description: >-
                          Pagination token for next page, or null if no more
                          results.
                        example: '1055:5'
              examples:
                signaturesResponse:
                  summary: Response with signature details only
                  value:
                    jsonrpc: '2.0'
                    id: '1'
                    result:
                      data:
                        - signature: >-
                            5h6xBEauJ3PK6SWCZ1PGjBvj8vDdWG3KpwATGy1ARAXFSDwt8GFXM7W5Ncn16wmqokgpiKRLuS83KUxyZyv2sUYv
                          slot: 1054
                          transactionIndex: 42
                          err: null
                          memo: null
                          blockTime: 1641038400
                          confirmationStatus: finalized
                        - signature: >-
                            kwjd820slPK6SWCZ1PGjBvj8vDdWG3KpwATGy1ARAXFSDwt8GFXM7W5Ncn16wmqokgpiKRLuS83KUxyZyv2sUYv
                          slot: 1055
                          transactionIndex: 15
                          err: null
                          memo: null
                          blockTime: 1641038460
                          confirmationStatus: finalized
                      paginationToken: '1055:5'
                fullResponse:
                  summary: Response with full transaction details
                  value:
                    jsonrpc: '2.0'
                    id: '1'
                    result:
                      data:
                        - slot: 1054
                          transactionIndex: 42
                          transaction:
                            signatures:
                              - >-
                                5h6xBEauJ3PK6SWCZ1PGjBvj8vDdWG3KpwATGy1ARAXFSDwt8GFXM7W5Ncn16wmqokgpiKRLuS83KUxyZyv2sUYv
                            message:
                              accountKeys:
                                - ...
                                - ...
                              instructions:
                                - ...
                          meta:
                            fee: 5000
                            preBalances:
                              - 1000000
                              - 2000000
                            postBalances:
                              - 999995000
                              - 2000000
                          blockTime: 1641038400
                      paginationToken: '1055:5'
        '400':
          description: Bad Request - Invalid request parameters or malformed request.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                jsonrpc: '2.0'
                error:
                  code: -32602
                  message: Invalid params
                id: '1'
        '401':
          description: Unauthorized - Invalid or missing API key.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                jsonrpc: '2.0'
                error:
                  code: -32001
                  message: Unauthorized
                id: '1'
        '429':
          description: Too Many Requests - Rate limit exceeded.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                jsonrpc: '2.0'
                error:
                  code: -32005
                  message: Too many requests
                id: '1'
        '500':
          description: Internal Server Error - An error occurred on the server.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                jsonrpc: '2.0'
                error:
                  code: -32603
                  message: Internal error
                id: '1'
        '503':
          description: Service Unavailable - The service is temporarily unavailable.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                jsonrpc: '2.0'
                error:
                  code: -32002
                  message: Service unavailable
                id: '1'
        '504':
          description: Gateway Timeout - The request timed out.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                jsonrpc: '2.0'
                error:
                  code: -32003
                  message: Gateway timeout
                id: '1'
      security:
        - ApiKeyQuery: []
components:
  schemas:
    ErrorResponse:
      type: object
      properties:
        jsonrpc:
          type: string
          description: The JSON-RPC protocol version.
          enum:
            - '2.0'
          example: '2.0'
        error:
          type: object
          properties:
            code:
              type: integer
              description: The error code.
              example: -32602
            message:
              type: string
              description: The error message.
            data:
              type: object
              description: Additional data about the error.
        id:
          type: string
          description: Identifier matching the request.
          example: '1'
  securitySchemes:
    ApiKeyQuery:
      type: apiKey
      in: query
      name: api-key
      description: >-
        Your Helius API key. You can get one for free in the
        [dashboard](https://dashboard.helius.dev/api-keys).

````
> ## Documentation Index
> Fetch the complete documentation index at: https://www.helius.dev/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# getSignaturesForAddress

> Returns signatures for confirmed transactions that include the given address in their `accountKeys` list. Returns signatures backwards in time from the provided signature or most recent confirmed block

<Tip>
  For advanced filtering, sorting, and token account history, use [`getTransactionsForAddress`](/rpc/gettransactionsforaddress) instead. Note that `getSignaturesForAddress` does not include transactions involving associated token accounts.
</Tip>

## Request Parameters

<ParamField body="address" type="string" required>
  Solana account address to retrieve transaction history for (wallet, token, program, NFT, etc.).
</ParamField>

<ParamField body="commitment" type="string">
  The commitment level for the request. The `processed` commitment is not supported.

  * `confirmed`
  * `finalized`
</ParamField>

<ParamField body="minContextSlot" type="number">
  The minimum slot that the request can be evaluated at.
</ParamField>

<ParamField body="limit" type="number">
  Maximum number of transaction signatures to return in a single request (1-1,000).
</ParamField>

<ParamField body="before" type="string">
  Pagination parameter to get transactions before this signature (earlier in time).
</ParamField>

<ParamField body="until" type="string">
  Get transactions until this signature is reached, useful for specific time ranges.
</ParamField>


## OpenAPI

````yaml openapi/rpc-http/getSignaturesForAddress.yaml post /
openapi: 3.1.0
info:
  title: Solana RPC API
  version: 1.0.0
  description: >-
    Comprehensive Solana transaction history API for retrieving and analyzing
    historical blockchain activities associated with any wallet address or
    program.
  license:
    name: Apache 2.0
    url: https://www.apache.org/licenses/LICENSE-2.0.html
servers:
  - url: https://mainnet.helius-rpc.com
    description: Mainnet RPC endpoint
  - url: https://devnet.helius-rpc.com
    description: Devnet RPC endpoint
security: []
paths:
  /:
    post:
      tags:
        - RPC
      summary: getSignaturesForAddress
      description: >
        Retrieve transaction signatures for activity involving a specific Solana
        address with powerful pagination.

        This essential API provides transaction history for any Solana wallet,
        token, program, or NFT address,

        returning chronological transaction signatures with their status,
        timing, and execution results.

        Perfect for building wallet transaction histories, program activity
        monitoring, address analytics,

        and any application that needs to track historical operations on the
        Solana blockchain.

        Supports flexible pagination for accessing complete transaction history.
      operationId: getSignaturesForAddress
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - jsonrpc
                - id
                - method
                - params
              properties:
                jsonrpc:
                  type: string
                  enum:
                    - '2.0'
                  example: '2.0'
                  description: The JSON-RPC protocol version.
                  default: '2.0'
                id:
                  type: string
                  example: '1'
                  description: A unique identifier for the request.
                  default: '1'
                method:
                  type: string
                  enum:
                    - getSignaturesForAddress
                  example: getSignaturesForAddress
                  description: The name of the RPC method to invoke.
                  default: getSignaturesForAddress
                params:
                  type: array
                  description: >-
                    Array containing the required account address and optional
                    configuration object.
                  default:
                    - Vote111111111111111111111111111111111111111
                  items:
                    oneOf:
                      - type: string
                        description: >-
                          Solana account address to retrieve transaction history
                          for (wallet, token, program, NFT, etc.).
                        example: Vote111111111111111111111111111111111111111
                      - type: object
                        description: >-
                          Advanced query configuration for customizing
                          transaction history retrieval.
                        properties:
                          commitment:
                            type: string
                            description: >-
                              The commitment level for the request. The
                              `processed` commitment is not supported.
                            enum:
                              - confirmed
                              - finalized
                            example: finalized
                          minContextSlot:
                            type: integer
                            description: >-
                              The minimum slot that the request can be evaluated
                              at.
                            example: 1000
                          limit:
                            type: integer
                            description: >-
                              Maximum number of transaction signatures to return
                              in a single request (1-1,000).
                            example: 1000
                          before:
                            type: string
                            description: >-
                              Pagination parameter to get transactions before
                              this signature (earlier in time).
                            example: >-
                              5h6xBEauJ3PK6SWCZ1PGjBvj8vDdWG3KpwATGy1ARAXFSDwt8GFXM7W5Ncn16wmqokgpiKRLuS83KUxyZyv2sUYv
                          until:
                            type: string
                            description: >-
                              Get transactions until this signature is reached,
                              useful for specific time ranges.
                            example: >-
                              3jweEauJ3PK6SWCZ1PGjBvj8vDdWG3KpwATGy1ARAXFSDwt8GFXM7W5Ncn16wmqokgpiKRLuS83KUxyZyv2sUYv
      responses:
        '200':
          description: Successfully retrieved signatures for the specified address.
          content:
            application/json:
              schema:
                type: object
                properties:
                  jsonrpc:
                    type: string
                    description: The JSON-RPC protocol version.
                    enum:
                      - '2.0'
                    example: '2.0'
                  id:
                    type: string
                    description: Identifier matching the request.
                    example: '1'
                  result:
                    type: array
                    description: List of transaction signature information.
                    items:
                      type: object
                      description: Details for each transaction signature.
                      properties:
                        signature:
                          type: string
                          description: Transaction signature as a base-58 encoded string.
                          example: >-
                            5h6xBEauJ3PK6SWCZ1PGjBvj8vDdWG3KpwATGy1ARAXFSDwt8GFXM7W5Ncn16wmqokgpiKRLuS83KUxyZyv2sUYv
                        slot:
                          type: integer
                          description: >-
                            The slot that contains the block with the
                            transaction.
                          example: 114
                        err:
                          oneOf:
                            - type: object
                              description: Error if the transaction failed
                            - type: 'null'
                          description: >-
                            Error if the transaction failed, or null if
                            successful.
                          example: null
                        memo:
                          oneOf:
                            - type: string
                              description: Memo associated with the transaction
                            - type: 'null'
                          description: >-
                            Memo associated with the transaction, or null if
                            none.
                          example: null
                        blockTime:
                          oneOf:
                            - type: integer
                              description: Estimated production time as Unix timestamp
                            - type: 'null'
                          description: >-
                            Estimated production time as Unix timestamp (seconds
                            since epoch), or null if not available.
                          example: null
                        confirmationStatus:
                          oneOf:
                            - type: string
                              enum:
                                - processed
                                - confirmed
                                - finalized
                              description: Transaction's cluster confirmation status
                            - type: 'null'
                          description: Transaction's cluster confirmation status.
                          example: finalized
              examples:
                response:
                  value:
                    jsonrpc: '2.0'
                    id: 1
                    result:
                      - signature: >-
                          5h6xBEauJ3PK6SWCZ1PGjBvj8vDdWG3KpwATGy1ARAXFSDwt8GFXM7W5Ncn16wmqokgpiKRLuS83KUxyZyv2sUYv
                        slot: 114
                        err: null
                        memo: null
                        blockTime: null
                        confirmationStatus: finalized
            application/json; schema=examples/request:
              example:
                jsonrpc: '2.0'
                id: 1
                method: getSignaturesForAddress
                params:
                  - Vote111111111111111111111111111111111111111
                  - limit: 1
        '400':
          description: Bad Request - Invalid request parameters or malformed request.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                jsonrpc: '2.0'
                error:
                  code: -32602
                  message: Invalid params
                id: '1'
        '401':
          description: Unauthorized - Invalid or missing API key.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                jsonrpc: '2.0'
                error:
                  code: -32001
                  message: Unauthorized
                id: '1'
        '429':
          description: Too Many Requests - Rate limit exceeded.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                jsonrpc: '2.0'
                error:
                  code: -32005
                  message: Too many requests
                id: '1'
        '500':
          description: Internal Server Error - An error occurred on the server.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                jsonrpc: '2.0'
                error:
                  code: -32603
                  message: Internal error
                id: '1'
        '503':
          description: Service Unavailable - The service is temporarily unavailable.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                jsonrpc: '2.0'
                error:
                  code: -32002
                  message: Service unavailable
                id: '1'
        '504':
          description: Gateway Timeout - The request timed out.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                jsonrpc: '2.0'
                error:
                  code: -32003
                  message: Gateway timeout
                id: '1'
      security:
        - ApiKeyQuery: []
components:
  schemas:
    ErrorResponse:
      type: object
      properties:
        jsonrpc:
          type: string
          description: The JSON-RPC protocol version.
          enum:
            - '2.0'
          example: '2.0'
        error:
          type: object
          properties:
            code:
              type: integer
              description: The error code.
              example: -32602
            message:
              type: string
              description: The error message.
            data:
              type: object
              description: Additional data about the error.
        id:
          type: string
          description: Identifier matching the request.
          example: '1'
  securitySchemes:
    ApiKeyQuery:
      type: apiKey
      in: query
      name: api-key
      description: >-
        Your Helius API key. You can get one for free in the
        [dashboard](https://dashboard.helius.dev/api-keys).

````
> ## Documentation Index
> Fetch the complete documentation index at: https://www.helius.dev/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# getTokenLargestAccounts

> Returns the 20 largest accounts of a particular SPL Token type.

## Request Parameters

<ParamField body="address" type="string" required>
  Solana token mint address to analyze for largest holder accounts and distribution patterns.
</ParamField>

<ParamField body="commitment" type="string">
  The commitment level for the request.

  * `confirmed`
  * `finalized`
  * `processed`
</ParamField>


## OpenAPI

````yaml openapi/rpc-http/getTokenLargestAccounts.yaml post /
openapi: 3.1.0
info:
  title: Solana RPC API
  version: 1.0.0
  description: >-
    Token concentration analysis API for identifying major holders and tracking
    token distribution patterns across the Solana blockchain ecosystem.
  license:
    name: Apache 2.0
    url: https://www.apache.org/licenses/LICENSE-2.0.html
servers:
  - url: https://mainnet.helius-rpc.com
    description: Mainnet RPC endpoint
  - url: https://devnet.helius-rpc.com
    description: Devnet RPC endpoint
security: []
paths:
  /:
    post:
      tags:
        - RPC
      summary: getTokenLargestAccounts
      description: >
        Identify and analyze the largest holders of any Solana SPL token with
        detailed balance information.

        This powerful token distribution API provides insights into token
        concentration patterns, 

        revealing major holders ("whales") and their relative positions.
        Essential for market analysis,

        token distribution audits, investor relations, and DAO governance
        tracking. Automatically

        returns addresses sorted by balance in descending order with proper
        decimal formatting

        for immediate integration into analytics dashboards and monitoring
        tools.
      operationId: getTokenLargestAccounts
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                jsonrpc:
                  type: string
                  enum:
                    - '2.0'
                  description: The JSON-RPC protocol version.
                  example: '2.0'
                  default: '2.0'
                id:
                  type: string
                  description: A unique identifier for the request.
                  example: '1'
                  default: '1'
                method:
                  type: string
                  enum:
                    - getTokenLargestAccounts
                  description: The name of the RPC method to invoke.
                  example: getTokenLargestAccounts
                  default: getTokenLargestAccounts
                params:
                  type: array
                  description: >-
                    Parameters for querying the largest token accounts for a
                    specific mint.
                  default:
                    - he1iusmfkpAdwvxLNGV8Y1iSbj4rUy6yMhEA3fotn9A
                  items:
                    oneOf:
                      - type: string
                        description: >-
                          Solana token mint address to analyze for largest
                          holder accounts and distribution patterns.
                        example: he1iusmfkpAdwvxLNGV8Y1iSbj4rUy6yMhEA3fotn9A
                      - type: object
                        description: Configuration object.
                        properties:
                          commitment:
                            type: string
                            description: The commitment level for the request.
                            enum:
                              - confirmed
                              - finalized
                              - processed
                            example: finalized
            examples:
              tokenRequest:
                $ref: '#/components/examples/tokenLargestAccountsRequest'
      responses:
        '200':
          description: Successfully retrieved the largest token accounts.
          content:
            application/json:
              schema:
                type: object
                properties:
                  jsonrpc:
                    type: string
                    description: The JSON-RPC protocol version.
                    enum:
                      - '2.0'
                    example: '2.0'
                  id:
                    type: string
                    description: Identifier matching the request.
                    example: '1'
                  result:
                    type: object
                    description: Context and token account details.
                    properties:
                      context:
                        type: object
                        description: Context of the response.
                        properties:
                          slot:
                            type: integer
                            description: Slot in which the data was fetched.
                            example: 1114
                      value:
                        type: array
                        description: List of token accounts with their balances.
                        items:
                          type: object
                          properties:
                            address:
                              type: string
                              description: >-
                                Solana wallet address holding a significant
                                portion of the token supply.
                              example: FYjHNoFtSQ5uijKrZFyYAxvEr87hsKXkXcxkcmkBAf4r
                            amount:
                              type: string
                              description: >-
                                Raw token balance of this major holder account
                                without decimal formatting.
                              example: '771'
                            decimals:
                              type: integer
                              description: >-
                                Number of decimal places defined by the token
                                for proper balance representation.
                              example: 2
                            uiAmount:
                              type: number
                              description: >-
                                Human-readable token balance of this major
                                holder with proper decimal formatting
                                (deprecated).
                              example: 7.71
                              deprecated: true
                            uiAmountString:
                              type: string
                              description: >-
                                Canonical string representation of this major
                                holder's token balance with decimal places.
                              example: '7.71'
              examples:
                tokenResponse:
                  $ref: '#/components/examples/tokenLargestAccountsResponse'
        '400':
          description: Bad Request - Invalid request parameters or malformed request.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                jsonrpc: '2.0'
                error:
                  code: -32602
                  message: Invalid params
                id: '1'
        '401':
          description: Unauthorized - Invalid or missing API key.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                jsonrpc: '2.0'
                error:
                  code: -32001
                  message: Unauthorized
                id: '1'
        '429':
          description: Too Many Requests - Rate limit exceeded.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                jsonrpc: '2.0'
                error:
                  code: -32005
                  message: Too many requests
                id: '1'
        '500':
          description: Internal Server Error - An error occurred on the server.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                jsonrpc: '2.0'
                error:
                  code: -32603
                  message: Internal error
                id: '1'
        '503':
          description: Service Unavailable - The service is temporarily unavailable.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                jsonrpc: '2.0'
                error:
                  code: -32002
                  message: Service unavailable
                id: '1'
        '504':
          description: Gateway Timeout - The request timed out.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                jsonrpc: '2.0'
                error:
                  code: -32003
                  message: Gateway timeout
                id: '1'
      security:
        - ApiKeyQuery: []
components:
  examples:
    tokenLargestAccountsRequest:
      value:
        jsonrpc: '2.0'
        id: '1'
        method: getTokenLargestAccounts
        params:
          - he1iusmfkpAdwvxLNGV8Y1iSbj4rUy6yMhEA3fotn9A
    tokenLargestAccountsResponse:
      value:
        jsonrpc: '2.0'
        id: '1'
        result:
          context:
            slot: 1114
          value:
            - address: FYjHNoFtSQ5uijKrZFyYAxvEr87hsKXkXcxkcmkBAf4r
              amount: '771'
              decimals: 2
              uiAmount: 7.71
              uiAmountString: '7.71'
            - address: BnsywxTcaYeNUtzrPxQUvzAWxfzZe3ZLUJ4wMMuLESnu
              amount: '229'
              decimals: 2
              uiAmount: 2.29
              uiAmountString: '2.29'
  schemas:
    ErrorResponse:
      type: object
      properties:
        jsonrpc:
          type: string
          description: The JSON-RPC protocol version.
          enum:
            - '2.0'
          example: '2.0'
        error:
          type: object
          properties:
            code:
              type: integer
              description: The error code.
              example: -32602
            message:
              type: string
              description: The error message.
            data:
              type: object
              description: Additional data about the error.
        id:
          type: string
          description: Identifier matching the request.
          example: '1'
  securitySchemes:
    ApiKeyQuery:
      type: apiKey
      in: query
      name: api-key
      description: >-
        Your Helius API key. You can get one for free in the
        [dashboard](https://dashboard.helius.dev/api-keys).

````
> ## Documentation Index
> Fetch the complete documentation index at: https://www.helius.dev/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# getTokenSupply

> Returns the total supply of an SPL Token type.

## Request Parameters

<ParamField body="address" type="string" required>
  Solana token mint address to retrieve supply metrics for (SPL token's unique identifier).
</ParamField>

<ParamField body="commitment" type="string">
  The commitment level for the request.

  * `confirmed`
  * `finalized`
  * `processed`
</ParamField>


## OpenAPI

````yaml openapi/rpc-http/getTokenSupply.yaml post /
openapi: 3.1.0
info:
  title: Solana RPC API
  version: 1.0.0
  description: >-
    Tokenomics analytics API for retrieving current circulation and total supply
    metrics for any SPL token or fungible asset on the Solana blockchain.
  license:
    name: Apache 2.0
    url: https://www.apache.org/licenses/LICENSE-2.0.html
servers:
  - url: https://mainnet.helius-rpc.com
    description: Mainnet RPC endpoint
  - url: https://devnet.helius-rpc.com
    description: Devnet RPC endpoint
security: []
paths:
  /:
    post:
      tags:
        - RPC
      summary: getTokenSupply
      description: >
        Retrieve comprehensive token supply metrics for any SPL token on the
        Solana blockchain.

        This essential tokenomics API provides accurate and real-time data on
        token circulating

        supply, total mint amount, and decimal configuration. Critical for token
        analytics dashboards,

        DeFi applications, market cap calculations, protocol metrics, and
        trading platforms that need

        reliable token supply information. Supports all SPL token types
        including fungible tokens and

        community tokens with proper decimal formatting for accurate display.
      operationId: getTokenSupply
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                jsonrpc:
                  type: string
                  enum:
                    - '2.0'
                  description: The JSON-RPC protocol version.
                  example: '2.0'
                  default: '2.0'
                id:
                  type: string
                  description: A unique identifier for the request.
                  example: '1'
                  default: '1'
                method:
                  type: string
                  enum:
                    - getTokenSupply
                  description: The name of the RPC method to invoke.
                  example: getTokenSupply
                  default: getTokenSupply
                params:
                  type: array
                  description: Parameters for querying the token supply.
                  default:
                    - 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU
                  items:
                    oneOf:
                      - type: string
                        description: >-
                          Solana token mint address to retrieve supply metrics
                          for (SPL token's unique identifier).
                        example: 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU
                      - type: object
                        description: Configuration object.
                        properties:
                          commitment:
                            type: string
                            description: The commitment level for the request.
                            enum:
                              - confirmed
                              - finalized
                              - processed
                            example: finalized
            examples:
              requestExample:
                value:
                  jsonrpc: '2.0'
                  id: '1'
                  method: getTokenSupply
                  params:
                    - 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU
      responses:
        '200':
          description: Successfully retrieved the token supply.
          content:
            application/json:
              schema:
                type: object
                properties:
                  jsonrpc:
                    type: string
                    description: The JSON-RPC protocol version.
                    enum:
                      - '2.0'
                    example: '2.0'
                  id:
                    type: string
                    description: Identifier matching the request.
                    example: '1'
                  result:
                    type: object
                    description: Context and token supply details.
                    properties:
                      context:
                        type: object
                        description: Context of the response.
                        properties:
                          slot:
                            type: integer
                            description: Slot in which the data was fetched.
                            example: 1114
                      value:
                        type: object
                        description: Token supply details.
                        properties:
                          amount:
                            type: string
                            description: >-
                              The raw total Solana token supply as a precise
                              integer string without decimal formatting.
                            example: '100000'
                          decimals:
                            type: integer
                            description: >-
                              Number of decimal places defined by the token for
                              accurate supply representation.
                            example: 2
                          uiAmount:
                            type: number
                            description: >-
                              The human-readable token supply with proper
                              decimal formatting (deprecated).
                            example: 1000
                          uiAmountString:
                            type: string
                            description: >-
                              The canonical string representation of the total
                              token supply with correct decimal places.
                            example: '1000'
              examples:
                responseExample:
                  value:
                    jsonrpc: '2.0'
                    id: '1'
                    result:
                      context:
                        slot: 1114
                      value:
                        amount: '100000'
                        decimals: 2
                        uiAmount: 1000
                        uiAmountString: '1000'
        '400':
          description: Bad Request - Invalid request parameters or malformed request.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                jsonrpc: '2.0'
                error:
                  code: -32602
                  message: Invalid params
                id: '1'
        '401':
          description: Unauthorized - Invalid or missing API key.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                jsonrpc: '2.0'
                error:
                  code: -32001
                  message: Unauthorized
                id: '1'
        '429':
          description: Too Many Requests - Rate limit exceeded.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                jsonrpc: '2.0'
                error:
                  code: -32005
                  message: Too many requests
                id: '1'
        '500':
          description: Internal Server Error - An error occurred on the server.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                jsonrpc: '2.0'
                error:
                  code: -32603
                  message: Internal error
                id: '1'
        '503':
          description: Service Unavailable - The service is temporarily unavailable.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                jsonrpc: '2.0'
                error:
                  code: -32002
                  message: Service unavailable
                id: '1'
        '504':
          description: Gateway Timeout - The request timed out.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                jsonrpc: '2.0'
                error:
                  code: -32003
                  message: Gateway timeout
                id: '1'
      security:
        - ApiKeyQuery: []
components:
  schemas:
    ErrorResponse:
      type: object
      properties:
        jsonrpc:
          type: string
          description: The JSON-RPC protocol version.
          enum:
            - '2.0'
          example: '2.0'
        error:
          type: object
          properties:
            code:
              type: integer
              description: The error code.
              example: -32602
            message:
              type: string
              description: The error message.
            data:
              type: object
              description: Additional data about the error.
        id:
          type: string
          description: Identifier matching the request.
          example: '1'
  securitySchemes:
    ApiKeyQuery:
      type: apiKey
      in: query
      name: api-key
      description: >-
        Your Helius API key. You can get one for free in the
        [dashboard](https://dashboard.helius.dev/api-keys).

````
> ## Documentation Index
> Fetch the complete documentation index at: https://www.helius.dev/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# getTransaction

> Returns transaction details for a confirmed transaction.

## Request Parameters

<ParamField body="transaction" type="string" required>
  Solana transaction signature as a base-58 encoded string for lookup.
</ParamField>

<ParamField body="transaction" type="string" required>
  Encoding format for the returned Solana transaction data.

  * `json`
  * `jsonParsed`
  * `base64`
  * `base58`
</ParamField>

<ParamField body="commitment" type="string">
  Blockchain commitment level for transaction finality verification.

  * `confirmed`
  * `finalized`
</ParamField>

<ParamField body="maxSupportedTransactionVersion" type="number">
  Maximum Solana transaction version to return in responses (for versioned transaction support).
</ParamField>


## OpenAPI

````yaml openapi/rpc-http/getTransaction.yaml post /
openapi: 3.1.0
info:
  title: Solana RPC API
  version: 1.0.0
  description: >-
    Advanced Solana transaction retrieval API for accessing detailed transaction
    data, signatures, and execution results from the Solana blockchain.
  license:
    name: Apache 2.0
    url: https://www.apache.org/licenses/LICENSE-2.0.html
servers:
  - url: https://mainnet.helius-rpc.com
    description: Mainnet RPC endpoint
  - url: https://devnet.helius-rpc.com
    description: Devnet RPC endpoint
security: []
paths:
  /:
    post:
      tags:
        - RPC
      summary: getTransaction
      description: >
        Retrieve comprehensive transaction details from the Solana blockchain by
        transaction signature.

        Access complete data including account changes, instruction details,
        token transfers, program

        logs, and execution status. Support for parsed data, multiple encoding
        formats, and transaction versions.
      operationId: getTransaction
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                jsonrpc:
                  type: string
                  enum:
                    - '2.0'
                  description: The JSON-RPC protocol version.
                  example: '2.0'
                  default: '2.0'
                id:
                  type: string
                  description: A unique identifier for the request.
                  example: '1'
                  default: '1'
                method:
                  type: string
                  enum:
                    - getTransaction
                  description: The name of the RPC method to invoke.
                  example: getTransaction
                  default: getTransaction
                params:
                  type: array
                  description: Parameters for querying a Solana transaction by signature.
                  default:
                    - >-
                      D13jTJYXoQBcRY9AfT5xRtsew7ENgCkNs6mwwwAcUCp4ZZCEM7YwZ7en4tVsoDa7Gu75Jjj2FgLXNUz8Zmgedff
                  items:
                    oneOf:
                      - type: string
                        description: >-
                          Solana transaction signature as a base-58 encoded
                          string for lookup.
                        example: >-
                          D13jTJYXoQBcRY9AfT5xRtsew7ENgCkNs6mwwwAcUCp4ZZCEM7YwZ7en4tVsoDa7Gu75Jjj2FgLXNUz8Zmgedff
                      - type: string
                        description: >-
                          Encoding format for the returned Solana transaction
                          data.
                        enum:
                          - json
                          - jsonParsed
                          - base64
                          - base58
                        example: json
                      - type: object
                        description: >-
                          Advanced configuration options for Solana transaction
                          retrieval.
                        properties:
                          commitment:
                            type: string
                            description: >-
                              Blockchain commitment level for transaction
                              finality verification.
                            enum:
                              - confirmed
                              - finalized
                            example: finalized
                          maxSupportedTransactionVersion:
                            type: integer
                            description: >-
                              Maximum Solana transaction version to return in
                              responses (for versioned transaction support).
                            example: 0
            example:
              jsonrpc: '2.0'
              id: '1'
              method: getTransaction
              params:
                - >-
                  2nBhEBYYvfaAe16UMNqRHre4YNSskvuYgx3M6E4JP1oDYvZEJHvoPzyUidNgNX5r9sTyN1J9UxtbCXy2rqYcuyuv
                - commitment: finalized
      responses:
        '200':
          description: Successfully retrieved the detailed Solana transaction data.
          content:
            application/json:
              schema:
                type: object
                properties:
                  jsonrpc:
                    type: string
                    description: The JSON-RPC protocol version.
                    enum:
                      - '2.0'
                    example: '2.0'
                  id:
                    type: string
                    description: Identifier matching the request.
                    example: '1'
                  result:
                    type: object
                    description: >-
                      Complete Solana transaction details including execution
                      data.
                    properties:
                      slot:
                        type: integer
                        description: >-
                          Solana blockchain slot number when this transaction
                          was processed.
                        example: 430
                      transaction:
                        type: object
                        description: >-
                          Comprehensive Solana transaction object with all
                          transaction details.
                        properties:
                          message:
                            type: object
                            description: >-
                              Solana transaction message containing detailed
                              execution instructions.
                            properties:
                              accountKeys:
                                type: array
                                description: >-
                                  List of Solana account public keys involved in
                                  the transaction.
                                items:
                                  type: string
                                  example: 3UVYmECPPMZSCqWKfENfuoTv51fTDTWicX9xmBD2euKe
                              header:
                                type: object
                                description: >-
                                  Solana transaction header metadata with access
                                  control information.
                                properties:
                                  numReadonlySignedAccounts:
                                    type: integer
                                    description: >-
                                      Number of read-only signed Solana accounts
                                      in the transaction.
                                    example: 0
                                  numReadonlyUnsignedAccounts:
                                    type: integer
                                    description: >-
                                      Number of read-only unsigned Solana
                                      accounts in the transaction.
                                    example: 3
                                  numRequiredSignatures:
                                    type: integer
                                    description: >-
                                      Number of required signatures for Solana
                                      transaction validation.
                                    example: 1
                              instructions:
                                type: array
                                description: >-
                                  List of program instructions executed within
                                  the Solana transaction.
                                items:
                                  type: object
                                  properties:
                                    accounts:
                                      type: array
                                      description: >-
                                        Indexed list of Solana accounts accessed
                                        by this instruction.
                                      items:
                                        type: integer
                                        example: 1
                                    data:
                                      type: string
                                      description: >-
                                        Encoded instruction data passed to the
                                        Solana program.
                                      example: >-
                                        37u9WtQpcm6ULa3WRQHmj49EPs4if7o9f1jSRVZpm2dvihR9C8jY4NqEwXUbLwx15HBSNcP1
                                    programIdIndex:
                                      type: integer
                                      description: >-
                                        Index of the Solana program that
                                        processes this instruction.
                                      example: 4
                              recentBlockhash:
                                type: string
                                description: >-
                                  Recent Solana blockhash used for transaction
                                  validity window.
                                example: mfcyqEXB3DnHXki6KjjmZck6YjmZLvpAByy2fj4nh6B
                          signatures:
                            type: array
                            description: >-
                              List of cryptographic signatures validating the
                              Solana transaction.
                            items:
                              type: string
                              example: >-
                                2nBhEBYYvfaAe16UMNqRHre4YNSskvuYgx3M6E4JP1oDYvZEJHvoPzyUidNgNX5r9sTyN1J9UxtbCXy2rqYcuyuv
                      meta:
                        type: object
                        description: Solana transaction execution metadata and results.
                        properties:
                          err:
                            oneOf:
                              - type: object
                              - type: 'null'
                            description: >-
                              Error information if Solana transaction failed;
                              null if successful.
                            example: null
                          fee:
                            type: integer
                            description: >-
                              Transaction fee paid in Solana lamports (1 SOL =
                              1,000,000,000 lamports).
                            example: 5000
                          innerInstructions:
                            type: array
                            description: >-
                              List of inner instructions generated during Solana
                              transaction execution.
                            items:
                              type: object
        '400':
          description: Bad Request - Invalid request parameters or malformed request.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                jsonrpc: '2.0'
                error:
                  code: -32602
                  message: Invalid params
                id: '1'
        '401':
          description: Unauthorized - Invalid or missing API key.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                jsonrpc: '2.0'
                error:
                  code: -32001
                  message: Unauthorized
                id: '1'
        '429':
          description: Too Many Requests - Rate limit exceeded.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                jsonrpc: '2.0'
                error:
                  code: -32005
                  message: Too many requests
                id: '1'
        '500':
          description: Internal Server Error - An error occurred on the server.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                jsonrpc: '2.0'
                error:
                  code: -32603
                  message: Internal error
                id: '1'
        '503':
          description: Service Unavailable - The service is temporarily unavailable.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                jsonrpc: '2.0'
                error:
                  code: -32002
                  message: Service unavailable
                id: '1'
        '504':
          description: Gateway Timeout - The request timed out.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                jsonrpc: '2.0'
                error:
                  code: -32003
                  message: Gateway timeout
                id: '1'
      security:
        - ApiKeyQuery: []
components:
  schemas:
    ErrorResponse:
      type: object
      properties:
        jsonrpc:
          type: string
          description: The JSON-RPC protocol version.
          enum:
            - '2.0'
          example: '2.0'
        error:
          type: object
          properties:
            code:
              type: integer
              description: The error code.
              example: -32602
            message:
              type: string
              description: The error message.
            data:
              type: object
              description: Additional data about the error.
        id:
          type: string
          description: Identifier matching the request.
          example: '1'
  securitySchemes:
    ApiKeyQuery:
      type: apiKey
      in: query
      name: api-key
      description: >-
        Your Helius API key. You can get one for free in the
        [dashboard](https://dashboard.helius.dev/api-keys).

````
> ## Documentation Index
> Fetch the complete documentation index at: https://www.helius.dev/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# simulateTransaction

> Simulate sending a transaction.

## Request Parameters

<ParamField body="transaction" type="string" required>
  The signed transaction, as an encoded string (base58 or base64).
</ParamField>

<ParamField body="encoding" type="string">
  Encoding used for the transaction data.

  * `base58`
  * `base64`
</ParamField>

<ParamField body="skipPreflight" type="boolean">
  Skip the preflight transaction checks.
</ParamField>

<ParamField body="preflightCommitment" type="string">
  Commitment level to use for preflight.

  * `confirmed`
  * `finalized`
  * `processed`
</ParamField>

<ParamField body="sigVerify" type="boolean">
  If true, verify the transaction signatures.
</ParamField>

<ParamField body="replaceRecentBlockhash" type="boolean">
  If true, replace the transaction recent blockhash with the most recent one.
</ParamField>

<ParamField body="minContextSlot" type="number">
  Minimum slot at which to perform preflight transaction checks.
</ParamField>

<ParamField body="innerInstructions" type="boolean">
  If true, include inner instructions in the response.
</ParamField>

<ParamField body="accounts" type="object" />

<ParamField body="accounts.addresses" type="array">
  Array of accounts to return, as base-58 encoded strings.
</ParamField>

<ParamField body="accounts.encoding" type="string">
  Encoding format for returned account data.

  * `base64`
  * `base58`
  * `base64+zstd`
  * `jsonParsed`
</ParamField>


## OpenAPI

````yaml openapi/rpc-http/simulateTransaction.yaml post /
openapi: 3.1.0
info:
  title: Solana RPC API
  version: 1.0.0
  description: >-
    Advanced Solana transaction simulation API for testing and debugging
    blockchain transactions before committing them to the Solana network.
  license:
    name: Apache 2.0
    url: https://www.apache.org/licenses/LICENSE-2.0.html
servers:
  - url: https://mainnet.helius-rpc.com
    description: Mainnet RPC endpoint
  - url: https://devnet.helius-rpc.com
    description: Devnet RPC endpoint
security: []
paths:
  /:
    post:
      tags:
        - RPC
      summary: simulateTransaction
      description: >
        Simulate Solana transactions without executing them on the blockchain.
        This powerful 

        debugging tool allows developers to test transaction execution, verify
        program behavior,

        estimate compute unit consumption, detect errors, and preview account
        state changes

        before committing transactions to the network. Essential for Solana
        application

        development, smart contract testing, and transaction optimization.
      operationId: simulateTransaction
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                jsonrpc:
                  type: string
                  enum:
                    - '2.0'
                  description: The JSON-RPC protocol version.
                  example: '2.0'
                  default: '2.0'
                id:
                  type: string
                  description: A unique identifier for the request.
                  example: '1'
                  default: '1'
                method:
                  type: string
                  enum:
                    - simulateTransaction
                  description: The name of the RPC method to invoke.
                  example: simulateTransaction
                  default: simulateTransaction
                params:
                  type: array
                  description: Parameters for simulating a transaction.
                  default:
                    - >-
                      AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAEDArczbMia1tLmq7zz4DinMNN0pJ1JtLdqIJPUw3YrGCzYAMHBsgN27lcgB6H2WQvFgyZuJYHa46puOQo9yQ8CVQbd9uHXZaGT2cvhRs7reawctIXtX1s3kTqM9YV+/wCp20C7Wj2aiuk5TReAXo+VTVg8QTHjs0UjNMMKCvpzZ+ABAgEBARU=
                    - encoding: base64
                  items:
                    oneOf:
                      - type: string
                        description: >-
                          The signed transaction, as an encoded string (base58
                          or base64).
                        example: >-
                          AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAEDArczbMia1tLmq7zz4DinMNN0pJ1JtLdqIJPUw3YrGCzYAMHBsgN27lcgB6H2WQvFgyZuJYHa46puOQo9yQ8CVQbd9uHXZaGT2cvhRs7reawctIXtX1s3kTqM9YV+/wCp20C7Wj2aiuk5TReAXo+VTVg8QTHjs0UjNMMKCvpzZ+ABAgEBARU=
                      - type: object
                        description: Configuration object for the simulation.
                        properties:
                          encoding:
                            type: string
                            description: Encoding used for the transaction data.
                            enum:
                              - base58
                              - base64
                            example: base64
                          skipPreflight:
                            type: boolean
                            description: Skip the preflight transaction checks.
                            example: false
                          preflightCommitment:
                            type: string
                            description: Commitment level to use for preflight.
                            enum:
                              - confirmed
                              - finalized
                              - processed
                            example: finalized
                          sigVerify:
                            type: boolean
                            description: If true, verify the transaction signatures.
                            example: false
                          replaceRecentBlockhash:
                            type: boolean
                            description: >-
                              If true, replace the transaction recent blockhash
                              with the most recent one.
                            example: false
                          minContextSlot:
                            type: integer
                            description: >-
                              Minimum slot at which to perform preflight
                              transaction checks.
                            example: 1000
                          innerInstructions:
                            type: boolean
                            description: >-
                              If true, include inner instructions in the
                              response.
                            example: false
                          accounts:
                            type: object
                            properties:
                              addresses:
                                type: array
                                description: >-
                                  Array of accounts to return, as base-58
                                  encoded strings.
                                items:
                                  type: string
                                  example: 83astBRguLMdt2h5U1Tpdq5tjFoJ6noeGwaY3mDLVcri
                              encoding:
                                type: string
                                description: Encoding format for returned account data.
                                enum:
                                  - base64
                                  - base58
                                  - base64+zstd
                                  - jsonParsed
                                example: base64
            example:
              jsonrpc: '2.0'
              id: '1'
              method: simulateTransaction
              params:
                - >-
                  AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAEDArczbMia1tLmq7zz4DinMNN0pJ1JtLdqIJPUw3YrGCzYAMHBsgN27lcgB6H2WQvFgyZuJYHa46puOQo9yQ8CVQbd9uHXZaGT2cvhRs7reawctIXtX1s3kTqM9YV+/wCp20C7Wj2aiuk5TReAXo+VTVg8QTHjs0UjNMMKCvpzZ+ABAgEBARU=
                - encoding: base64
      responses:
        '200':
          description: Successfully simulated the transaction.
          content:
            application/json:
              schema:
                type: object
                properties:
                  jsonrpc:
                    type: string
                    description: The JSON-RPC protocol version.
                    enum:
                      - '2.0'
                    example: '2.0'
                  id:
                    type: string
                    description: Identifier matching the request.
                    example: '1'
                  result:
                    type: object
                    description: Result of the simulated transaction.
                    properties:
                      context:
                        type: object
                        description: Context of the simulation response.
                        properties:
                          apiVersion:
                            type: string
                            description: The API version of the RPC node.
                            example: 2.3.3
                          slot:
                            type: integer
                            description: Slot in which the data was fetched.
                            example: 393226680
                      value:
                        type: object
                        description: Details of the simulated transaction result.
                        properties:
                          accounts:
                            type:
                              - array
                              - 'null'
                            items:
                              type: object
                              description: Account details associated with the transaction.
                              example:
                                lamports: 5000
                                owner: TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA
                          err:
                            type:
                              - object
                              - 'null'
                            description: >-
                              Error if the transaction failed, null if
                              successful.
                            example: null
                          innerInstructions:
                            type:
                              - array
                              - 'null'
                            description: >-
                              Inner instructions executed during the
                              transaction.
                            example: null
                          loadedAccountsDataSize:
                            type:
                              - integer
                              - 'null'
                            description: >-
                              Total size in bytes of all account data loaded
                              during simulation.
                            example: 413
                          logs:
                            type:
                              - array
                              - 'null'
                            items:
                              type: string
                            description: >-
                              Program execution logs from the transaction
                              simulation.
                            example:
                              - >-
                                Program
                                TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb
                                invoke [1]
                              - 'Program log: Instruction: Transfer'
                              - >-
                                Program
                                TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb
                                consumed 1714 of 200000 compute units
                              - >-
                                Program
                                TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb
                                success
                          replacementBlockhash:
                            type:
                              - object
                              - 'null'
                            description: >-
                              Replacement blockhash information when
                              replaceRecentBlockhash is enabled.
                            properties:
                              blockhash:
                                type: string
                                description: The replacement blockhash.
                                example: 6oFLsE7kmgJx9PjR4R63VRNtpAVJ648gCTr3nq5Hihit
                              lastValidBlockHeight:
                                type: integer
                                description: >-
                                  The last valid block height for the
                                  replacement blockhash.
                                example: 381186895
                          returnData:
                            type:
                              - object
                              - 'null'
                            properties:
                              programId:
                                type: string
                                example: 83astBRguLMdt2h5U1Tpdq5tjFoJ6noeGwaY3mDLVcri
                              data:
                                type: array
                                items:
                                  type: string
                                example:
                                  - Kg==
                                  - base64
                            description: Data returned by the transaction if any.
                            example: null
                          unitsConsumed:
                            type:
                              - integer
                              - 'null'
                            description: >-
                              Total compute units consumed during the
                              simulation.
                            example: 1714
              example:
                jsonrpc: '2.0'
                id: 1
                result:
                  context:
                    apiVersion: 2.3.3
                    slot: 393226680
                  value:
                    accounts: null
                    err: null
                    innerInstructions: null
                    loadedAccountsDataSize: 413
                    logs:
                      - >-
                        Program TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb
                        invoke [1]
                      - 'Program log: Instruction: Transfer'
                      - >-
                        Program TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb
                        consumed 1714 of 200000 compute units
                      - >-
                        Program TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb
                        success
                    replacementBlockhash:
                      blockhash: 6oFLsE7kmgJx9PjR4R63VRNtpAVJ648gCTr3nq5Hihit
                      lastValidBlockHeight: 381186895
                    returnData: null
                    unitsConsumed: 1714
        '400':
          description: Bad Request - Invalid request parameters or malformed request.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                jsonrpc: '2.0'
                error:
                  code: -32602
                  message: Invalid params
                id: '1'
        '401':
          description: Unauthorized - Invalid or missing API key.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                jsonrpc: '2.0'
                error:
                  code: -32001
                  message: Unauthorized
                id: '1'
        '429':
          description: Too Many Requests - Rate limit exceeded.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                jsonrpc: '2.0'
                error:
                  code: -32005
                  message: Too many requests
                id: '1'
        '500':
          description: Internal Server Error - An error occurred on the server.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                jsonrpc: '2.0'
                error:
                  code: -32603
                  message: Internal error
                id: '1'
        '503':
          description: Service Unavailable - The service is temporarily unavailable.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                jsonrpc: '2.0'
                error:
                  code: -32002
                  message: Service unavailable
                id: '1'
        '504':
          description: Gateway Timeout - The request timed out.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                jsonrpc: '2.0'
                error:
                  code: -32003
                  message: Gateway timeout
                id: '1'
      security:
        - ApiKeyQuery: []
components:
  schemas:
    ErrorResponse:
      type: object
      properties:
        jsonrpc:
          type: string
          description: The JSON-RPC protocol version.
          enum:
            - '2.0'
          example: '2.0'
        error:
          type: object
          properties:
            code:
              type: integer
              description: The error code.
              example: -32602
            message:
              type: string
              description: The error message.
            data:
              type: object
              description: Additional data about the error.
        id:
          type: string
          description: Identifier matching the request.
          example: '1'
  securitySchemes:
    ApiKeyQuery:
      type: apiKey
      in: query
      name: api-key
      description: >-
        Your Helius API key. You can get one for free in the
        [dashboard](https://dashboard.helius.dev/api-keys).

````
> ## Documentation Index
> Fetch the complete documentation index at: https://www.helius.dev/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# getTokenAccounts

> Retrieve all SPL token accounts owned by a wallet address including token balances, mint addresses, and account metadata with pagination

## Request Parameters

<ParamField body="mint" type="string">
  The mint address key.
</ParamField>

<ParamField body="owner" type="string">
  The owner address key.
</ParamField>

<ParamField body="page" type="number">
  The page of results to return.
</ParamField>

<ParamField body="limit" type="number">
  The maximum number of assets to return.
</ParamField>

<ParamField body="cursor" type="string">
  The cursor used for pagination.
</ParamField>

<ParamField body="before" type="string">
  Returns results before the specified cursor.
</ParamField>

<ParamField body="after" type="string">
  Returns results after the specified cursor.
</ParamField>

<ParamField body="options" type="object" />

<ParamField body="options.showZeroBalance" type="boolean">
  If true, show accounts with empty token balances.
</ParamField>


## OpenAPI

````yaml openapi/das-api/getTokenAccounts.yaml post /
openapi: 3.1.0
info:
  title: Solana RPC API
  version: 1.0.0
  license:
    name: Apache 2.0
    url: https://www.apache.org/licenses/LICENSE-2.0.html
servers:
  - url: https://mainnet.helius-rpc.com
    description: Mainnet RPC endpoint
  - url: https://devnet.helius-rpc.com
    description: Devnet RPC endpoint
security: []
paths:
  /:
    post:
      tags:
        - RPC
      summary: getTokenAccounts
      description: Returns a list of token accounts for a given mint and owner.
      operationId: rpc
      requestBody:
        content:
          application/json:
            schema:
              type: object
              required:
                - jsonrpc
                - id
                - method
                - params
              properties:
                jsonrpc:
                  type: string
                  enum:
                    - '2.0'
                  description: The version of the JSON-RPC protocol.
                  default: '2.0'
                id:
                  type: string
                  description: An ID to identify the request.
                  example: '1'
                  default: '1'
                method:
                  type: string
                  enum:
                    - getTokenAccounts
                  description: The name of the method to invoke.
                  default: getTokenAccounts
                params:
                  type: object
                  default:
                    owner: 86xCnPeV69n6t3DnyGvkKobf9FdN2H9oiVDdaMpo2MMY
                  properties:
                    mint:
                      type: string
                      description: The mint address key.
                      example: string
                    owner:
                      type: string
                      description: The owner address key.
                      example: 86xCnPeV69n6t3DnyGvkKobf9FdN2H9oiVDdaMpo2MMY
                    page:
                      type: integer
                      description: The page of results to return.
                      example: 1
                    limit:
                      type: integer
                      description: The maximum number of assets to return.
                      example: 100
                    cursor:
                      type: string
                      description: The cursor used for pagination.
                    before:
                      type: string
                      description: Returns results before the specified cursor.
                    after:
                      type: string
                      description: Returns results after the specified cursor.
                    options:
                      type: object
                      properties:
                        showZeroBalance:
                          type: boolean
                          description: If true, show accounts with empty token balances.
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                type: object
                properties:
                  last_indexed_slot:
                    type: integer
                    description: >-
                      All data up to and including this slot is guaranteed to
                      have been indexed.
                    example: 365750752
                  total:
                    type: integer
                    description: The number of results found for the request.
                    example: 2
                  limit:
                    type: integer
                    description: The maximum number of results requested.
                    example: 100
                  cursor:
                    type: string
                    description: The cursor used for pagination.
                  token_accounts:
                    type: array
                    description: An array of token accounts.
                    items:
                      type: object
                      properties:
                        address:
                          type: string
                          description: The address of the token account.
                        mint:
                          type: string
                          description: The address of the mint account.
                        owner:
                          type: string
                          description: The address of the token account owner.
                        amount:
                          type: integer
                          description: Number of tokens in the account.
                        delegated_amount:
                          type: integer
                          description: Number of delegated tokens in the account.
                        frozen:
                          type: boolean
                          description: If the account is frozen.
                        burnt: false
        '400':
          description: >-
            Bad Request. The server could not understand the request due to
            invalid syntax.
          content:
            application/json:
              schema:
                type: object
                properties:
                  jsonrpc:
                    type: string
                    example: '2.0'
                  error:
                    type: object
                    properties:
                      code:
                        type: integer
                        example: -32602
                      message:
                        type: string
                        example: Invalid request parameters.
                  id:
                    type: string
                    example: '1'
        '401':
          description: >-
            Unauthorized. The client must authenticate itself to get the
            requested response.
          content:
            application/json:
              schema:
                type: object
                properties:
                  jsonrpc:
                    type: string
                    example: '2.0'
                  error:
                    type: object
                    properties:
                      code:
                        type: integer
                        example: -32001
                      message:
                        type: string
                        example: Authentication failed. Missing or invalid API key.
                  id:
                    type: string
                    example: '1'
        '403':
          description: Forbidden. The client does not have access rights to the content.
          content:
            application/json:
              schema:
                type: object
                properties:
                  jsonrpc:
                    type: string
                    example: '2.0'
                  error:
                    type: object
                    properties:
                      code:
                        type: integer
                        example: -32003
                      message:
                        type: string
                        example: You do not have permission to access this resource.
                  id:
                    type: string
                    example: '1'
        '404':
          description: Not Found. The server can not find the requested resource.
          content:
            application/json:
              schema:
                type: object
                properties:
                  jsonrpc:
                    type: string
                    example: '2.0'
                  error:
                    type: object
                    properties:
                      code:
                        type: integer
                        example: -32004
                      message:
                        type: string
                        example: The requested resource was not found.
                  id:
                    type: string
                    example: '1'
        '429':
          description: >-
            Too Many Requests. The user has sent too many requests in a given
            amount of time.
          content:
            application/json:
              schema:
                type: object
                properties:
                  jsonrpc:
                    type: string
                    example: '2.0'
                  error:
                    type: object
                    properties:
                      code:
                        type: integer
                        example: -32029
                      message:
                        type: string
                        example: Rate limit exceeded. Please try again later.
                  id:
                    type: string
                    example: '1'
        '500':
          description: >-
            Internal Server Error. The server has encountered a situation it
            doesn't know how to handle.
          content:
            application/json:
              schema:
                type: object
                properties:
                  jsonrpc:
                    type: string
                    example: '2.0'
                  error:
                    type: object
                    properties:
                      code:
                        type: integer
                        example: -32000
                      message:
                        type: string
                        example: An unexpected error occurred on the server.
                  id:
                    type: string
                    example: '1'
      security:
        - ApiKeyQuery: []
components:
  securitySchemes:
    ApiKeyQuery:
      type: apiKey
      in: query
      name: api-key
      description: >-
        Your Helius API key. You can get one for free in the
        [dashboard](https://dashboard.helius.dev/api-keys).

````