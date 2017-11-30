import React from 'react'
import Style from './Loader.css'
import { CircularProgress } from 'mui-next/Progress'

export default () => (
    <div className={Style.loaderContainer}>
        <CircularProgress />
    </div>
)