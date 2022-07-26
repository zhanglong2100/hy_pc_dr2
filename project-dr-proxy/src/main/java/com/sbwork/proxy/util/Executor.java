package com.sbwork.proxy.util;


import lombok.extern.slf4j.Slf4j;

import java.util.concurrent.*;

@Slf4j
public class Executor {
    private static ThreadPoolExecutor threadPool = null;
    private Executor(){}
    /**
     * Cannot instantiate.
     */
    public static ThreadPoolExecutor newMyexecutor(int size) {
        if(threadPool == null){
            synchronized( Executor.class ) {
                if( threadPool == null ) {

                    threadPool = new ThreadPoolExecutor(size, size + 10,
                            1, TimeUnit.MINUTES, new ArrayBlockingQueue<Runnable>(16)) {
                        protected void afterExecute(Runnable r, Throwable t) {
                            super.afterExecute(r, t);
                            printException(r, t);
                        }
                    };
                }
            }

        }

        return  threadPool;
    }


    private static void printException(Runnable r, Throwable t) {
        if (t == null && r instanceof Future<?>) {
            try {
                Future<?> future = (Future<?>) r;
                if (future.isDone())
                    future.get();
            } catch (CancellationException ce) {
                t = ce;
            } catch (ExecutionException ee) {
                t = ee.getCause();
            } catch (InterruptedException ie) {
                Thread.currentThread().interrupt(); // ignore/reset
            }
        }
        if (t != null)
            log.error(t.getMessage(), t);
    }
}
